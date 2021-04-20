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

## Commits and Releasing

Commits (generally via merged pull requests) to the `main` branch of this repository will automatically generate [semantically versioned releases](https://github.com/semantic-release). To accomplish this, commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) syntax, specifically:

For bug fixes:
```
fix(scope): <description>

[optional content]
```

For features:
```
feat(scope): <description>

[optional content]
```

In general, the scope should be the command name or topic, but there may be exceptions. The description of feature and fix issues should contain a reference to a github issue, e.g. Fixes #200.
