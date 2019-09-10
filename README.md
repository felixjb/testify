# Testify

[![Build Status](https://travis-ci.com/felixjb/testify.svg?branch=master)](https://travis-ci.com/felixjb/testify)

Testify is a JavaScript and Typescript test runner extension for VSCode. It adds codelens near `describe`, `it`, and `test` keywords enabling VSCode to run associated tests and output the results in the integrated terminal.
Currently it works **out of the box** for **Mocha** and **Jest** test runner.

## Demo

![demo](resources/demo.gif)

## Configuration

The following configuration properties are available:

| Property                 | Description                                        | Example                      |
| ------------------------ | -------------------------------------------------- | ---------------------------- |
| `testify.additionalArgs` | CLI args to pass to test runner                    | "--watch"                    |
| `testify.envVars`        | Environment variables to set before running a test | { "NODE_ENV": "test" }       |
| `testify.skipFiles`      | Array of glob patterns for script paths to skip    | ["<node_internals>/**/*.js"] |

## Compatibility

This extension works currently with :

-   Mocha
-   Jest

## Versioning

We use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for versioning. For the versions available, see the [tags on this repository](https://github.com/felixjb/testify/tags).
Also, this project adheres to [Keep a Changelog](http://keepachangelog.com/).

## Contributing

Please read the [CONTRIBUTING](https://github.com/felixjb/testify/blob/master/CONTRIBUTING.md), and, specially, the [CODE OF CONDUCT](https://github.com/felixjb/testify/blob/master/CODE_OF_CONDUCT.md) documents.

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/16679401?s=460&v=4" width="100px;" alt="Felix J. Batista"/><br /><sub><b>Felix J. Batista</b></sub>](https://github.com/felixjb)<br />[💻](https://github.com/felixjb/Testify/commits?author=felixjb "Code") [🤔](#ideas-felixjb "Ideas, Planning, & Feedback") | [<img src="https://avatars0.githubusercontent.com/u/11415256?v=4" width="100px;" alt="Willian Silva"/><br /><sub><b>Willian Silva</b></sub>](https://github.com/silvawillian)<br />[💻](https://github.com/felixjb/Testify/commits?author=silvawillian "Code") | [<img src="https://avatars1.githubusercontent.com/u/11151445?v=4" width="100px;" alt="Geoffrey"/><br /><sub><b>Geoffrey</b></sub>](https://github.com/g3offrey)<br />[💻](https://github.com/felixjb/Testify/commits?author=g3offrey "Code") [🤔](#ideas-g3offrey "Ideas, Planning, & Feedback") | [<img src="https://avatars0.githubusercontent.com/u/3911114?v=4" width="100px;" alt="Johan Rouve"/><br /><sub><b>Johan Rouve</b></sub>](https://github.com/ooga)<br />[🐛](https://github.com/felixjb/Testify/issues?q=author%3Aooga "Bug reports") [💻](https://github.com/felixjb/Testify/commits?author=ooga "Code") | [<img src="https://avatars0.githubusercontent.com/u/26111050?v=4" width="100px;" alt="Kreshchenko Nickolay"/><br /><sub><b>Kreshchenko Nickolay</b></sub>](https://github.com/nkreshchenko)<br />[💻](https://github.com/felixjb/Testify/commits?author=nkreshchenko "Code") [🤔](#ideas-nkreshchenko "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/41467575?v=4" width="100px;" alt="Sascha Dais"/><br /><sub><b>Sascha Dais</b></sub>](https://github.com/roggenbrot)<br />[🐛](https://github.com/felixjb/Testify/issues?q=author%3Aroggenbrot "Bug reports") [💻](https://github.com/felixjb/Testify/commits?author=roggenbrot "Code") [🤔](#ideas-roggenbrot "Ideas, Planning, & Feedback") |
| :---: | :---: | :---: | :---: | :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

Also, a big special **thank you to Barbara Iamauchi** who designed the amazing new icon for this project!

[<img src="https://media.licdn.com/dms/image/C5103AQHx1YaYR23COg/profile-displayphoto-shrink_800_800/0?e=1570665600&v=beta&t=p93yp1lZXWJXBKLjTp9cq__flzRvTpMxTnAHzLSKFRQ" width="100px;" alt="Barbara Iamauchi"/><br /><sub><b>Barbara Iamauchi</b></sub>](https://www.linkedin.com/in/barbara-iamauchi-772732121/)<br />

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Authors

-   **Geoffrey** - _Initial work_ - Github: [@g3offrey](https://github.com/g3offrey)
-   **Felix J. Batista** - _Forked project_ - Github: [@felixjb](https://github.com/felixjb)

based on [JavaScript Test Runner](https://github.com/g3offrey/javascript-test-runner) by **Geoffrey**

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/felixjb/testify/blob/master/LICENSE) file for details.
