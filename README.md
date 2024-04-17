[![CI/CD](https://github.com/felixjb/testify/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/felixjb/testify/actions/workflows/ci-cd.yaml)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/felixjb.testify)](https://marketplace.visualstudio.com/items?itemName=felixjb.testify)

<p align="center">
  <a title="Run JavaScript tests easily using CodeLens" href="https://marketplace.visualstudio.com/items?itemName=felixjb.testify">
    <img src="https://raw.githubusercontent.com/felixjb/testify/main/resources/icon.png" alt="Testify"/>
  </a>
</p>

# Testify

Testify is an [open-source](https://github.com/felixjb/testify 'Open Testify on GitHub') extension for [Visual Studio Code](https://code.visualstudio.com 'Learn more about VSCode').

Testify **enables** you to run or debug JavaScript tests **individually** or **entire suites** with a **single click** through **code lens**. It adds code lens near any compatible test framework **keywords** and outputs the results to the **integrated terminal**.

If you need any information, try using our **ever-expanding** [Wiki](https://github.com/felixjb/testify/wiki). Or, if you have any **questions** or need any **help**, **join us** in the [Discussions](https://github.com/felixjb/testify/discussions).

## Compatibility

Testify maintainers are **always** working to support **more** frameworks as **best** as possible. Testify currently works with these test frameworks:

- [Mocha](https://mochajs.org/)
- [Jest](https://jestjs.io/)
- [AVA](https://github.com/avajs/ava)
- [Playwright](https://playwright.dev/)

## Demo

![demo](resources/demo.gif)

## Configuration

You can configure Testify to work a little more to your taste using VSCode's settings. Here are all the configuration properties are available:

| Property                 | Description                                                                                                      | Example                        | Default                  |
|--------------------------|------------------------------------------------------------------------------------------------------------------|--------------------------------|--------------------------|
| `testify.additionalArgs` | Specifies arguments to be passed to the test framework command.<br>It takes a single string with all arguments.  | `"--require ts-node/register"` | `""`                     |
| `testify.envVars`        | Specifies environment variables to be exported before running a test.                                            | `{ "NODE_ENV": "test" }`       | `{ "NODE_ENV": "test" }` |
| `testify.skipFiles`      | Specifies files that should be skipped during debugging.<br>It takes an array of glob patterns.                  | `["<node_internals>/**/*.js"]` | `[]`                     |
| `testify.testRunnerPath` | Specifies a custom path for the test runner executable.                                                          | `"node_modules/.bin/mocha"`    | `""`                     |

<!-- You can use this tool to generate a markdown table: https://www.tablesgenerator.com/markdown_tables# -->

## Versioning

We use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for versioning. For the versions available, see the [tags on this repository](https://github.com/felixjb/testify/tags).
Also, this project adheres to [Keep a Changelog](http://keepachangelog.com/).

## Contributing

Please read the [CONTRIBUTING](https://github.com/felixjb/testify/blob/main/CONTRIBUTING.md), and, specially, the [CODE OF CONDUCT](https://github.com/felixjb/testify/blob/main/CODE_OF_CONDUCT.md) documents.

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/felixjb"><img src="https://avatars2.githubusercontent.com/u/16679401?s=460&v=4?s=100" width="100px;" alt=""/><br /><sub><b>Felix J. Batista</b></sub></a><br /><a href="https://github.com/felixjb/testify/commits?author=felixjb" title="Code">💻</a> <a href="#ideas-felixjb" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/silvawillian"><img src="https://avatars0.githubusercontent.com/u/11415256?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Willian Silva</b></sub></a><br /><a href="https://github.com/felixjb/testify/commits?author=silvawillian" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/g3offrey"><img src="https://avatars1.githubusercontent.com/u/11151445?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Geoffrey</b></sub></a><br /><a href="https://github.com/felixjb/testify/commits?author=g3offrey" title="Code">💻</a> <a href="#ideas-g3offrey" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/ooga"><img src="https://avatars0.githubusercontent.com/u/3911114?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Johan Rouve</b></sub></a><br /><a href="https://github.com/felixjb/testify/issues?q=author%3Aooga" title="Bug reports">🐛</a> <a href="https://github.com/felixjb/testify/commits?author=ooga" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/nkreshchenko"><img src="https://avatars0.githubusercontent.com/u/26111050?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kreshchenko Nickolay</b></sub></a><br /><a href="https://github.com/felixjb/testify/commits?author=nkreshchenko" title="Code">💻</a> <a href="#ideas-nkreshchenko" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/roggenbrot"><img src="https://avatars1.githubusercontent.com/u/41467575?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sascha Dais</b></sub></a><br /><a href="https://github.com/felixjb/testify/issues?q=author%3Aroggenbrot" title="Bug reports">🐛</a> <a href="https://github.com/felixjb/testify/commits?author=roggenbrot" title="Code">💻</a> <a href="#ideas-roggenbrot" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/LoveSponge"><img src="https://avatars3.githubusercontent.com/u/12626802?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Guy</b></sub></a><br /><a href="https://github.com/felixjb/testify/commits?author=LoveSponge" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/calebboyd"><img src="https://avatars2.githubusercontent.com/u/5818726?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Caleb Boyd</b></sub></a><br /><a href="https://github.com/felixjb/testify/issues?q=author%3Acalebboyd" title="Bug reports">🐛</a> <a href="https://github.com/felixjb/testify/commits?author=calebboyd" title="Code">💻</a> <a href="#maintenance-calebboyd" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://felipecrs.com"><img src="https://avatars.githubusercontent.com/u/29582865?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Felipe Santos</b></sub></a><br /><a href="#infra-felipecrs" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Also, a special **thank you to Barbara Iamauchi** who designed the amazing new icon for this project!

[<img src="https://raw.githubusercontent.com/felixjb/testify/main/resources/babi.jpg" width="100px;" alt="Barbara Iamauchi"/><br /><sub><b>Barbara Iamauchi</b></sub>](https://www.linkedin.com/in/barbara-iamauchi-772732121/)<br />

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Authors

- **Geoffrey** - _Initial work_ - Github: [@g3offrey](https://github.com/g3offrey)
- **Felix J. Batista** - _Forked project_ - Github: [@felixjb](https://github.com/felixjb)

based on [JavaScript Test Runner](https://github.com/g3offrey/javascript-test-runner) by **Geoffrey**

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/felixjb/testify/blob/main/LICENSE) file for details.
