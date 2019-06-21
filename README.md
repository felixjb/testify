# Testify

Testify is a JavaScript and Typescript test runner extension for VSCode. It adds codelens near `describe`, `it`, and `test` keywords enabling VSCode to run associated tests and output the results in the integrated terminal.
Currently it works **out of the box** for **Mocha** and **Jest** test runner.

## Demo

![demo](./resources//demo.gif)

## Configuration

The following configuration properties are available:

| Property                 | Description                                        | Example                |
| ------------------------ | -------------------------------------------------- | ---------------------- |
| `testify.additionalArgs` | CLI args to pass to test runner                    | "--watch"              |
| `testify.envVars`        | Environment variables to set before running a test | { "NODE_ENV": "test" } |

## Compatibility

This extension works currently with :

-   Mocha
-   Jest

## Versioning

We use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for versioning. For the versions available, see the [tags on this repository](https://github.com/felixjb/testify/tags).
Also, this project adheres to [Keep a Changelog](http://keepachangelog.com/).

## Contributing

Please read the [CONTRIBUTING](https://gist.github.com/felixjb/f06bd4b0888ccb9aace87c6ae2a3cd2d) document for details on our code of conduct, and the process for submitting pull requests to us.

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Authors

-   **Felix J. Batista** - _Initial work_ - Github: [@felixjb](https://github.com/felixjb)

_based on extension by_ **Geoffrey** - Github: [@g3offrey](https://github.com/g3offrey)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/felixjb/testify/blob/master/LICENSE) file for details.
