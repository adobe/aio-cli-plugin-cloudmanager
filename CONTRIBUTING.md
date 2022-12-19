# Contributing

Thanks for choosing to contribute!

The following are a set of guidelines to follow when contributing to this project.

## Code Of Conduct

This project adheres to the Adobe [code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [Grp-opensourceoffice@adobe.com](mailto:Grp-opensourceoffice@adobe.com).

## Contributor License Agreement

All third-party contributions to this project must be accompanied by a signed contributor license agreement. This gives Adobe permission to redistribute your contributions as part of the project. [Sign our CLA](http://opensource.adobe.com/cla.html). You only need to submit an Adobe CLA one time, so if you have submitted one previously, you are good to go!

## Code Reviews

All submissions should come in the form of pull requests and need to be reviewed by project committers. Read [GitHub's pull request documentation](https://help.github.com/articles/about-pull-requests/) for more information on sending pull requests.

Please follow the [pull request template](PULL_REQUEST_TEMPLATE.md) when submitting a pull request. Following the requirements for semantic releases (as described in the next section), each pull request should contain a single change and be comprised of a single commit.

**Pull requests created from forks won't be able to successfully run the E2E tests. We can’t use E2E secrets with workflows from a forked repository.**

## Error Handling

In order to ensure proper error handling, individual commands should generally *not* handle errors themselves. Commands should throw errors and allow them to be caught by the `catch` method in `BaseCommand`. There may be exceptions specifically around errors that are non-fatal. Thrown errors should be defined in either `ValidationErrors` or `ConfigurationErrors`.

Hooks should work in a similar fashion -- see the prerun `check-ims-context-config` hook as a point of reference.

## Custom Command Class Properties

In addition to the standard [oclif command properties](https://oclif.io/docs/commands), commands in this plugin may define these extra properties:

* `skipOrgIdCheck` -- This should be set to `true` if the command does *not* require an IMS Organization ID to be configured in the current IMS context. This is primarily used when using browser-based authentication as service account authentication will always have an organization ID.
* `permissionInfo` -- This is used to output information to the CLI user about the permissions required to execute a particular command. This must be an object. Currently a single key is supported `operation` which must correspond to one of the operations defined in https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json. If a command doesn't require specific permissions (e.g. is a read-only operation), this should be set to an empty object.

## Commits and Releasing

Commits (generally via merged pull requests) to the `main` branch of this repository will automatically generate [semantically versioned releases](https://github.com/semantic-release). To accomplish this, commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) syntax, specifically:

For bug fixes:
```
fix(scope): <description> fixes #<issue number>

[optional content]
```

For features:
```
feat(scope): <description> fixes #<issue number>

[optional content]
```

In general, the scope should be the command name or topic, but there may be exceptions. The description of feature and fix issues should contain a reference to a github issue, e.g. fixes #200.
