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
const {isWithinFiveMinutesOfUTCMidnight, sleep} = require('./cloudmanager-helpers')
const fetch = require('node-fetch')
const zlib = require('zlib')
const halfred = require('halfred')
const UriTemplate = require('uritemplate')
const fs = require("fs")
const util = require("util")
const streamPipeline = util.promisify(require("stream").pipeline)
const _ = require("lodash")

const { rels, basePath } = require('./constants')
const { getBaseUrl, getCurrentStep, getWaitingStep } = require('./cloudmanager-helpers')

class Client {

    constructor(orgId, accessToken, apiKey) {
        this.orgId = orgId
        this.accessToken = accessToken
        this.apiKey = apiKey
    }

    async _doRequest(path, method, body, message) {
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
        return new Promise((resolve, reject) => {
            fetch(url, options).then(res => {
                if (res.ok) resolve(res)
                else {
                    res.text().then(text => {
                        debug(text)
                        if (res.ok) resolve(res)
                        else {
                        const error = new Error(`${message}: ${res.url} (${res.status} ${res.statusText})`)
                        error.res = res
                        reject(error)
                        }
                    })
                }
            })
        })
    }

    async get(path, message) {
        return this._doRequest(path, 'GET', null, message)
    }

    async put(path, body, message) {
        return this._doRequest(path, 'PUT', body, message)
    }

    async delete(path, message) {
        return this._doRequest(path, 'DELETE', null, message)
    }

    async patch(path, body, message) {
        return this._doRequest(path, 'PATCH', body, message)
    }

    async _listPrograms() {
        return this.get(basePath, 'Cannot retrieve programs').then(res => {
            return res.json()
        }, e => {
            throw e
        })
    }

    async listPrograms() {
        const result = await this._listPrograms()
        return (result && halfred.parse(result).embeddedArray('programs')) || []
    }

    async getProgram(path) {
        return this.get(path, 'Cannot retrieve program').then(res => {
            return res.json()
        }, e => {
            throw e
        })
    }

    async _listPipelines(path) {
        return this.get(path, 'Cannot retrieve pipelines').then(res => {
            return res.json()
        }, e => {
            throw e
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

        return this.put(pipeline.link(rels.execution).href, null, 'Cannot start execution').then(res => {
            return res.headers.get("location")
        }, e => {
            if (e.res.status === 412) throw new Error("Cannot create execution. Pipeline already running.")
            else throw e
        })
    }

    async getCurrentExecution(programId, pipelineId) {
        const pipelines = await this.listPipelines(programId)
        const pipeline = pipelines.find(p => p.id === pipelineId)
        if (!pipeline) {
            throw new Error(`Cannot get execution. Pipeline ${pipelineId} does not exist.`)
        }

        return this.get(pipeline.link(rels.execution).href, 'Cannot get current execution').then(res => {
            return res.json()
        }, e => {
            throw e
        })
    }

    async getExecution(programId, pipelineId, executionId) {
        const pipelines = await this.listPipelines(programId)
        const pipeline = pipelines.find(p => p.id === pipelineId)
        if (!pipeline) {
            throw new Error(`Cannot get execution. Pipeline ${pipelineId} does not exist.`)
        }
        const executionTemplate = UriTemplate.parse(pipeline.link(rels.executionId).href)
        const executionLink = executionTemplate.expand({executionId: executionId})
        return this.get(executionLink, 'Cannot get execution').then(res => {
            return res.json()
        }, e => {
            throw e
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
            case 'devDeploy':
                return execution.embeddedArray("stepStates").find(stepState => stepState.action === 'deploy' && stepState.environmentType === 'dev')
            case 'stageDeploy':
                return execution.embeddedArray("stepStates").find(stepState => stepState.action === 'deploy' && stepState.environmentType === 'stage')
            case 'prodDeploy':
                return execution.embeddedArray("stepStates").find(stepState => stepState.action === 'deploy' && stepState.environmentType === 'prod')
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
        return this.get(stepState.link(rels.metrics).href, 'Cannot get metrics').then(res => {
            return res.json()
        }, e => {
            throw e
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

        return this.put(href, body, 'Cannot cancel execution').then(() => {
            return {}
        }, e => {
            throw e
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

        return this.put(href, body, 'Cannot advance execution').then(() => {
            return {}
        }, e => {
            throw e
        })
    }

    async _listEnvironments(path) {
        return this.get(path, 'Cannot retrieve environments').then(res => {
            return res.json()
        }, e => {
            throw e
        })
    }

    async listEnvironments(programId) {
        const programs = await this.listPrograms();
        let program = programs.find(p => p.id === programId);
        if (!program) {
            throw new Error(`Could not find program ${programId}`)
        }
        program = await this.getProgram(program.link(rels.self).href)
        program = halfred.parse(program)

        const result = await this._listEnvironments(program.link(rels.environments).href)
        let environments = result && halfred.parse(result).embeddedArray('environments')
        if (!environments) {
            throw new Error(`Could not find environments for program ${programId}`)
        }
        return environments
    }

    async _getLogsForStepState(stepState, outputStream) {
        return this.get(stepState.link(rels.stepLogs).href, 'Cannot get log').then(async (res) => {
            const json = await res.json()
            if (json.redirect) {
                await fetch(json.redirect).then(res => res.body.pipe(outputStream))
                return {}
            } else {
                throw new Error(`Log ${res.url} did not contain a redirect. Was ${JSON.stringify(json)}.`)
            }
        }, e => {
            throw e
        })
    }

    async getExecutionStepLog(programId, pipelineId, executionId, action, outputStream) {
        const execution = halfred.parse(await this.getExecution(programId, pipelineId, executionId))

        const stepState = this.findStepState(execution, action)

        if (!stepState) {
            throw new Error(`Cannot find step state for action ${action} on execution ${executionId}.`)
        }

        return this._getLogsForStepState(stepState, outputStream)
    }

    async _getEnvironment(programId, environmentId) {
        const environments = await this.listEnvironments(programId)
        const environment = environments.find(e => e.id === environmentId);
        if (!environment) {
            throw new Error(`Could not find environment ${environmentId} for program ${programId}`)
        }
        return environment
    }

    async listAvailableLogOptions(programId, environmentId) {
        const environment = await this._getEnvironment(programId, environmentId);

        return environment.availableLogOptions || []
    }

    async _getLogs(environment, service, name, days) {
        if (!environment.link(rels.logs)) {
            throw new Error(`Could not find logs link for environment ${environment.id} for program ${environment.programId}`)
        }
        const logsTemplate = UriTemplate.parse(environment.link(rels.logs).href)
        const logsLink = logsTemplate.expand({service: service, name: name, days: days})

        return this.get(logsLink).then((res) => {
            if (res.ok) return res.json()
            else throw new Error(`Cannot get logs: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async _download(href, outputPath, resultObject) {
        const res = await this.get(href, 'Could not obtain download link')

        const downloadUrl = res.url

        const json = await res.json()
        if (!json || !json.redirect) {
            debug(json)
            throw new Error(`Could not retrieve redirect from ${res.url} (${res.status} ${res.statusText})`)
        }

        const redirectUrl = json.redirect

        const logRes = await fetch(redirectUrl)
        if (!logRes.ok) throw new Error(`Could not download ${logRes.url} to ${outputPath} (${logRes.status} ${logRes.statusText})`)

        await this._streamAndUnzip(logRes.body, fs.createWriteStream(outputPath)).catch(
            function (error) {
                if (error.errno !== -5 || error.code !== 'Z_BUF_ERROR') {
                    throw new Error(`Could not unzip ${logRes.url} to ${outputPath}`)
                }
            }
        )

        return {
            ...resultObject,
            path: outputPath,
            url: downloadUrl
        };
    }

    async _streamAndUnzip(src, dest) {
        await streamPipeline(src, zlib.createGunzip(), dest)
    }

    async downloadLogs(programId, environmentId, service, name, days, outputDirectory) {
        let environments = await this.listEnvironments(programId)
        let environment = environments.find(e => e.id === environmentId);
        if (!environment) {
            throw new Error(`Could not find environment ${environmentId} for program ${programId}`)
        }
        let logs = await this._getLogs(environment, service, name, days);
        logs = halfred.parse(logs);

        const downloads = logs.embeddedArray("downloads") || []

        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory)
        }

        const downloadPromises = [];

        downloads.forEach(download => {
            const downloadLinks = download.linkArray(rels.logsDownload);

            if (downloadLinks.length == 0) {
                return;
            } else if (downloadLinks.length == 1) {
                const downloadName = `${download.service}-${download.name}-${download.date}.log`
                const path = `${outputDirectory}/${environmentId}-${downloadName}`
                downloadPromises.push(this._download(downloadLinks[0].href, path, {
                    ...download,
                    index: 0
                }));
            } else {
                for (let i = 0; i < downloadLinks.length; i++) {
                    const downloadName = `${download.service}-${download.name}-${download.date}-${i}.log`
                    const path = `${outputDirectory}/${environmentId}-${downloadName}`
                    downloadPromises.push(this._download(downloadLinks[i].href, path, {
                        ...download,
                        index: i
                    }));
                }
            }
        });

        const downloaded = await Promise.all(downloadPromises)

        return downloaded
    }

    async _getLogFileSizeInitialSize(url) {
        let options = {
            method: 'HEAD'
        };
        const res = await fetch(url, options)
        if (!res.ok) throw new Error(`Could not get initial size of ${url}`)
        return res.headers.get("content-length");
    }

    async tailLog(programId, environmentId, service, name, writeStream) {
        let environments = await this.listEnvironments(programId)
        let environment = environments.find(e => e.id === environmentId);
        if (!environment) {
            throw new Error(`Could not find environment ${environmentId} for program ${programId}`)
        }
        let tailingSasUrl = await this._getTailingSasUrl(programId, environment, service, name);
        let contentLength = await this._getLogFileSizeInitialSize(tailingSasUrl);
        await this._getLiveStream(programId, environment, service, name, tailingSasUrl, contentLength, writeStream);
    }

    async _getLiveStream (programId, environment, service, name, tailingSasUrl, currentStartLimit, writeStream) {
        for(;;) {
            let options = {
                headers : {
                    Range: 'bytes='+ currentStartLimit + '-'
                }
            };
            let res = await fetch(tailingSasUrl, options);
            if (res.status === 206) {
                let contentLength = res.headers.get("content-length");
                res.body.pipe(writeStream);
                currentStartLimit =  parseInt(currentStartLimit) + parseInt(contentLength);
            } else if (res.status === 416) {
                await sleep(2000);
                /**
                 * Handles the rollover around UTC midnight using delta of 5 minutes before and after midnight
                 * to account for client's clock synchronisation
                 */
                if (isWithinFiveMinutesOfUTCMidnight(new Date())) {
                    tailingSasUrl = await this._getTailingSasUrl(programId, environment, service, name);
                    let startLimit = await this._getLogFileSizeInitialSize(tailingSasUrl);
                    if (parseInt(startLimit) < parseInt(currentStartLimit)) {
                        currentStartLimit = startLimit;
                    } else {
                        //sleep to reduce number of requests to ssg around UTC midnight
                        await sleep(2000);
                    }
                }
            } else if (res.status === 404) {
                throw new Error(`Logs not found! ${res.url} (${res.status} ${res.statusText})`)
            } else {
                throw new Error(`Cannot get tail logs: ${res.url} (${res.status} ${res.statusText})`)
            }
        }
    }

    async _getTailingSasUrl(programId, environment, service, name) {
        let logs = await this._getLogs(environment, service, name, 1);
        logs = halfred.parse(logs);
        const downloads = logs.embeddedArray("downloads") || []
        if (downloads && downloads.length > 0) {
            const tailLinks = downloads[0].linkArray(rels.logsTail)
            if (tailLinks && tailLinks.length > 0) {
                return tailLinks[0].href;
            } else {
                throw new Error(`No logs for tailing available in ${environment.id} for program ${programId}`)
            }
        } else {
            throw new Error(`No logs available in ${environment.id} for program ${programId}`)
        }
    }

    async deletePipeline(programId, pipelineId) {
        const pipelines = await this.listPipelines(programId)
        const pipeline = pipelines.find(p => p.id === pipelineId)
        if (!pipeline) {
            throw new Error(`Cannot delete pipeline. Pipeline ${pipelineId} does not exist.`)
        }

        return this.delete(pipeline.link(rels.self).href, 'Cannot delete pipeline').then(() => {
            return {}
        }, e => {
            throw e
        })
    }

    async updatePipeline(programId, pipelineId, changes) {
        const pipelines = await this.listPipelines(programId)
        const pipeline = pipelines.find(p => p.id === pipelineId)
        if (!pipeline) {
            throw new Error(`Cannot update pipeline. Pipeline ${pipelineId} does not exist.`)
        }

        const patch = {
            phases: []
        }

        if (changes.branch || changes.repositoryId) {
            const buildPhase = pipeline.phases.find(phase => phase.type === "BUILD")
            if (!buildPhase) {
                throw new Error(`Pipeline ${pipelineId} does not appear to have a build phase`)
            }
            const newBuildPhase = _.clone(buildPhase);
            if (changes.branch) {
                newBuildPhase.branch = changes.branch
            }
            if (changes.repositoryId) {
                newBuildPhase.repositoryId = changes.repositoryId
            }
            patch.phases.push(newBuildPhase)
        }

        return this.patch(pipeline.link(rels.self).href, patch).then((res) => {
            if (res.ok) return res.json()
            else throw new Error(`Cannot update pipeline: ${res.url} (${res.status} ${res.statusText})`)
        })
    }

    async getDeveloperConsoleUrl(programId, environmentId) {
        let environments = await this.listEnvironments(programId)
        let environment = environments.find(e => e.id === environmentId);
        if (!environment) {
            throw new Error(`Could not find environment ${environmentId} for program ${programId}`)
        }

        let link = environment.link("http://ns.adobe.com/adobecloud/rel/developerConsole")
        if (!link && environment.namespace && environment.cluster) {
            link = {
                href: `https://dev-console-${environment.namespace}.${environment.cluster}.dev.adobeaemcloud.com/dc/`
            }
        }

        if (link) {
            return link.href
        } else {
            throw new Error(`Environment ${environmentId} does not appear to support Developer Console.`)
        }
    }

    async _getVariablesLink(programId, environmentId) {
        const environment = await this._getEnvironment(programId, environmentId)

        const variablesLink = environment.link(rels.variables);
        if (!variablesLink) {
            throw new Error(`Could not find variables link for environment ${environmentId} for program ${programId}`)
        }
        return variablesLink.href
    }

    async getEnvironmentVariables(programId, environmentId) {
        const variablesLink = await this._getVariablesLink(programId, environmentId);

        const variables = await this.get(variablesLink, 'Cannot get variables').then(res => {
            return res.json()
        }, e => {
            throw e
        })

        const result = halfred.parse(variables).embeddedArray("variables")
        return result ? result.map(v => v.original()) : []
    }

    async setEnvironmentVariables(programId, environmentId, variables) {
        const variablesLink = await this._getVariablesLink(programId, environmentId);

        return await this.patch(variablesLink, variables, "Cannot set variables").then(() => {
            return true
        }, e => {
            throw e
        })
    }
}

module.exports = Client
