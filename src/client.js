/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const debug = require('debug')('aio-cli-plugin-cloudmanager')
const fetch = require('node-fetch')
const halfred = require('halfred')

const { rels, basePath } = require('./constants')
const { getBaseUrl, getCurrentStep, getWaitingStep } = require('./cloudmanager-helpers')

class Client {

    constructor(orgId, accessToken, apiKey) {
        this.orgId = orgId
        this.accessToken = accessToken
        this.apiKey = apiKey
    }

    async _doRequest(path, method, body) {
        const baseUrl = await getBaseUrl()
        const url = `${baseUrl}${path}`
        const options = {
            method: method,
            headers: {
                'x-gw-ims-org-id': this.orgId,
                'X-Api-Key': this.apiKey,
                Authorization: `Bearer ${this.accessToken}`,
                accept: 'application/json'
            }
        }
        if (body) {
            options.body = JSON.stringify(body)
            options.headers['content-type'] = 'application/json'
        }

        debug(`fetch: ${url}`)
        return fetch(url, options)
    }

    async get(path) {
        return this._doRequest(path, 'GET')
    }

    async put(path, body) {
        return this._doRequest(path, 'PUT', body)
    }

    async _listPrograms() {
        return this.get(basePath).then((res) => {
            if (res.ok) return res.json()
            else throw new Error(`Cannot retrieve programs: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async listPrograms() {
        const result = await this._listPrograms()
        return (result && halfred.parse(result).embeddedArray('programs')) || []
    }

    async getProgram(path) {
        return this.get(path).then((res) => {
            if (res.ok) return res.json()
            else throw new Error(`Cannot retrieve program: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async _listPipelines(path) {
        return this.get(path).then((res) => {
            if (res.ok) return res.json()
            else throw new Error(`Cannot retrieve pipelines: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async listPipelines(programId, options) {
        const programs = await this.listPrograms();
        let program = programs.find(p => p.id === programId);
        if (!program) {
            throw new Error(`Could not find program ${programId}`)
        }
        program = await this.getProgram(program.link(rels.self).href)
        program = halfred.parse(program)

        const result = await this._listPipelines(program.link(rels.pipelines).href)
        let pipelines = result && halfred.parse(result).embeddedArray('pipelines')
        if (!pipelines) {
            throw new Error(`Could not find pipelines for program ${programId}`)
        }
        if (options && options.busy) {
            pipelines = pipelines.filter(pipeline => pipeline.status === "BUSY")
        }
        return pipelines
    }

    async startExecution(programId, pipelineId) {
        const pipelines = await this.listPipelines(programId)
        const pipeline = pipelines.find(p => p.id === pipelineId)
        if (!pipeline) {
            throw new Error(`Cannot start execution. Pipeline ${pipelineId} does not exist.`)
        }

        return this.put(pipeline.link(rels.execution).href).then((res) => {
            if (res.ok) return res.headers.get("location")
            else if (res.status === 412) throw new Error("Cannot create execution. Pipeline already running.")
            else throw new Error(`Cannot start execution: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async getCurrentExecution(programId, pipelineId) {
        const pipelines = await this.listPipelines(programId)
        const pipeline = pipelines.find(p => p.id === pipelineId)
        if (!pipeline) {
            throw new Error(`Cannot get execution. Pipeline ${pipelineId} does not exist.`)
        }

        return this.get(pipeline.link(rels.execution).href).then((res) => {
            if (res.ok) return res.json()
            else throw new Error(`Cannot get current execution: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async getExecution(programId, pipelineId, executionId) {
        const pipelines = await this.listPipelines(programId)
        const pipeline = pipelines.find(p => p.id === pipelineId)
        if (!pipeline) {
            throw new Error(`Cannot get execution. Pipeline ${pipelineId} does not exist.`)
        }
        return this.get(`${pipeline.link(rels.execution).href}/${executionId}`).then((res) => {
            if (res.ok) return res.json()
            else throw new Error(`Cannot get execution: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    findStepState(execution, action) {
        let gates

        switch (action) {
            case 'security':
                return execution.embeddedArray("stepStates").find(stepState => stepState.action === 'securityTest')
            case 'performance':
                gates = execution.embeddedArray("stepStates").filter(stepState => stepState.action === 'loadTest' || stepState.action === 'assetsTest' || stepState.action === 'reportPerformanceTest')
                if (gates) {
                    return gates[gates.length - 1]
                } else {
                    return
                }
            default:
                return execution.embeddedArray("stepStates").find(stepState => stepState.action === action)
        }
    }

    async getQualityGateResults(programId, pipelineId, executionId, action) {
        const execution = halfred.parse(await this.getExecution(programId, pipelineId, executionId))

        const stepState = this.findStepState(execution, action)

        if (!stepState) {
            throw new Error(`Cannot find step state for action ${action} on execution ${executionId}.`)
        }

        return this._getMetricsForStepState(stepState)
    }

    async _getMetricsForStepState(stepState) {
        return this.get(`${stepState.link(rels.metrics).href}`).then((res) => {
            if (res.ok) return res.json()
            else throw new Error(`Cannot get metrics: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async cancelCurrentExecution(programId, pipelineId) {
        const execution = halfred.parse(await this.getCurrentExecution(programId, pipelineId))
        const step = getCurrentStep(execution)
        if (!step || !step.link) {
            throw new Error(`Cannot find a current step for pipeline ${pipelineId}`)
        }
        const cancelHalLink = step.link(rels.cancel)
        if (!cancelHalLink) {
            throw new Error(`Cannot find a cancel link for the current step (${step.action}). Step may not be cancellable.`)
        }
        const href = cancelHalLink.href

        const body = {}
        if (step.action === "approval") {
            body.approved = false
        } else if (step.action === "managed") {
            body.start = false
        } else if (step.status === "WAITING" && step.action !== "schedule") {
            body.override = false
        } else if (step.action === "deploy") {
            body.resume = false
        } else {
            body.cancel = true
        }

        return this.put(href, body).then((res) => {
            if (res.ok) return {}
            else throw new Error(`Cannot cancel execution: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async advanceCurrentExecution(programId, pipelineId) {
        const execution = halfred.parse(await this.getCurrentExecution(programId, pipelineId))
        const step = getWaitingStep(execution)
        if (!step || !step.link) {
            throw new Error(`Cannot find a waiting step for pipeline ${pipelineId}`)
        }
        const advanceHalLink = step.link(rels.advance)
        if (!advanceHalLink) {
            throw new Error(`Cannot find an advance link for the current step (${step.action})`)
        }
        const href = advanceHalLink.href

        const body = {}
        if (step.action === "approval") {
            body.approved = true
        } else if (step.action === "managed") {
            body.start = true
        } else if (step.action === "schedule") {
            throw new Error("Cannot advanced schedule step (yet)")
        } else if (step.action === "deploy") {
            body.resume = true
        } else {
            const results = await this._getMetricsForStepState(step);
            body.metrics = results.metrics.filter(metric => metric.severity === 'important' && metric.passed === false).map(metric => {
                return {
                    ...metric,
                    override: true
                }
            })
        }

        return this.put(href, body).then((res) => {
            if (res.ok) return {}
            else throw new Error(`Cannot advance execution: ${res.url} (${res.status} ${res.statusText})`)
        })
    }
}

module.exports = Client
