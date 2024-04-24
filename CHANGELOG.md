# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.1] - 2024-04-24

### Fixed

- Fixed run test command using `undefined` value when no value supplied for watch option

## [1.11.0] - 2024-04-24

### Added

- Add Watch test command to run tests in watch mode - thanks to @Beleren
- Add vue as a supported file type for test detection

### Changed

- Shorten the commands CodeLens text by removing the `Test` suffix
- Reuse the open terminal instance when running tests
- Customize the terminal name, icon and color
- Use "cwd" option to create terminal instead of manually navigating to workspace URI
- Add error message for unsupported test runner
- Improve error messages by adding name and path

### Fixed

- Fix bundling issue with webpack that caused the extension to not load CodeLens

## [1.10.0] - 2024-04-17

### Changed

- Change activation events to `onLanguage:typescript` and `onLanguage:javascript` to improve performance
- Update documentation files, workflows and general development experience

### Fixed

- Fix test command so it escapes quotes in test description

### Security

- Update all project dependencies to address vulnerabilities and keep the project up to date

## [1.9.0] - 2021-07-23

### Added

- Support for playwright test runner

## [1.8.0] - 2021-01-06

### Added

- Add support to jest-each intellisense and improve overall code parsing and test detection
- Add @calebboyd as a contributor.

### Fixed

- Fix parser incorrectly identifying Regexp .test method as a test
- Fix parser incorrectly identifying identifier with name "it" as a test

## [1.7.0] - 2020-12-12

### Added

- Add support to decorators in the parser
- Add @calebboyd as a contributor.

## [1.6.1] - 2020-08-06

### Changed

- Migrate CI from Travis to GitHub Actions
- Rename default branch to "main"

### Fixed

- Fix package vulnerabilities

## [1.6.0] - 2020-08-05

### Added

- Support for AVA test runner. Thanks to @LoveSponge
- Add @LoveSponge as a contributor.

### Fixed

- Add missing contributor picture to README.

## [1.5.0] - 2020-08-05

### Changed

- Enable optional chaining and nullish coalescing TypeScript syntaxes. Thanks to @silvawillian

## [1.4.1] - 2019-05-13

### Fixed

- Fix Mocha test filter option.
- Fix Mocha debug options.

## [1.4.0] - 2019-09-27

### Fixed

- Fix integrated terminal instances bug.

### Added

- Add `suite`, `context` and `specify` keywords to test token list.

## [1.3.0] - 2019-09-08

### Added

- Add `testRunnerPath` configuration.

## [1.2.1] - 2019-08-18

### Fixed

- Fix windows file path recognition.

### Changed

- Update `skipFile` configuration to use new VSCode's string arrays format.

## [1.2.0] - 2019-08-10

### Added

- Add `skipFile` configuration (a.k.a. "Not My Code" feature).

## [1.1.0] - 2019-06-24

### Added

- Add support to tests with spread operator `(...)`. Thanks to @silvawillian

## [1.0.0] - 2019-06-21

- Initial release.
