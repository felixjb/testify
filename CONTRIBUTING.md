# Contributing

:+1::tada: First off, **Thanks!** for taking the time to contribute! :tada::+1:

If you took interest in contributing, you're already awesome. Even
more so now that you came to read these guidelines. In fact, reading through
Testify's code and documents is a free audit that every community member
actively donates to the project and is much appreciated.

This guide was adapted from [Atom](https://github.com/atom/atom)

---

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[I have a question!](#i-have-a-question)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)

[How Can I Contribute?](#how-can-i-contribute)

- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Pull Requests](#pull-requests)

[Style Guides](#style-guides)

- [Git Commit Messages](#git-commit-messages)
- [TypeScript Style Guide](#typescript-style-guide)
- [Testing Style Guide](#testing-style-guide)
- [Documentation Style Guide](#documentation-style-guide)

---

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [felixjbcomp@gmail.com](mailto:felixjbcomp@gmail.com).

## I have a question

> **Note:** You'll get faster results by using the resources below.

We have an official message board, GitHub Discussions, where the community can give you helpful advice if you have questions or need any help. Also, we are always working on our Wiki to provide additional information.

- [Discussions](https://github.com/felixjb/testify/discussions)
- [Wiki](https://github.com/felixjb/testify/wiki)

## What should I know before I get started?

As a VSCode Extension, Testify is expected to be compatible with different platforms, such as Windows, Linux and MacOS Operating Systems and, more recently, browsers. Keep this in mind when developing the project as different platforms have different requirements and might work differently (e.g.: file paths on Windows are different than Linux)

Similarly, as Testify attempts to be a fast and convenient way to run tests in JavaScript, we try to support as many test frameworks as best as we can. There's still room to improve on adding new test frameworks and features, but as the project grows, the more complex it will be to maintain and evolve. That means we should be cautious when adding features that might not work with all frameworks and require feature toggles.

Any design and major project decisions should be documented on our Wiki.

And remember, if you need any help, feel free to reach out. The [previous section](#i-have-a-question) has a summary of the project's official channels.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing [issues](https://github.com/felixjb/testify/issues) as you might find out that your bug has already been reported.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

To report a bug, open a new issue and fill out the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and provide as much information as possible. Also, remember to make yourself available to answer any questions.

Explain the problem and include additional details to help maintainers reproduce the problem:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and GIFs** which show you following the described steps and clearly demonstrate the problem. If you use the keyboard while following the steps, **record the GIF with the shortcuts status bar shown**. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions:

- **Did the problem start happening recently** (e.g. after updating to a new version of Testify) or was this always a problem?
- If the problem started happening recently, **can you reproduce the problem in an older version of Testify?** What's the most recent version in which the problem doesn't happen? You can download older versions of Testify from the [extensions menu](https://github.com/microsoft/vscode/issues/12764#issuecomment-442370545).
- **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.

Include details about your configuration and environment:

- **Which version of Testify are you using?** You can get the exact version by hovering the extension card with your mouse in the extensions menu.
- **Which version of VSCode are you using?** You can get the exact version in the "About" section in the "Help" menu.
- **What's the name and version of the OS you're using?**
- **Which test framework are you using in your project?**
- **Are you using any custom Testify configuration?** Check your configurations in VSCode, both the Workspace and User sections.

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Testify which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
- **Explain why this enhancement would be useful** to most Testify users
- **Specify which platforms and test frameworks the suggested enhancement is related to**

### Your First Code Contribution

Unsure where to begin contributing to Testify? You can start by looking through these `help-wanted` issues:

- [Help wanted issues][help-wanted] - issues that our maintainers and contributors need a little help.

Issue lists can be sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

### Pull Requests

The process described here has several goals:

- Maintain Testify's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Atom
- Enable a sustainable system for Testify's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](.github/pull_request_template.md)
2. Follow the [style guides](#style-guides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

A few more good practices to help the maintainers:

- Try to keep the pull request concise. This will help the maintainers do the code review more quickly. Also it helps track down and revert changes that might add bugs before we make a release.
- Breaking changes should be discussed first. Make sure to make it clear that your pull requests implements a breaking change.

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Style Guides

### Git Commit Messages

Commits should follow the [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/). This is required and enforced by [commitlint](https://commitlint.js.org/#/) in the project.

Commits should reference project issues in their subject lines, and multiple commits should be squashed if they address the same issue. In addition, commits should follow the guidelines from "[How to write a good git commit message](http://chris.beams.io/posts/git-commit/)":

    1.  Subject is separated from body by a blank line
    2.  Subject is limited to 50 characters (not including issue reference)
    3.  Subject does not end with a period
    4.  Subject uses the imperative mood ("add", not "adding")
    5.  Body wraps at 72 characters
    6.  Body explains "what" and "why", not "how"

### TypeScript Style Guide

All TypeScript code is linted with [ESLint](https://eslint.org/) and organized with [Prettier](https://prettier.io/).
The style required and is enforced during development with tasks that run on git hooks with [Husky](https://typicode.github.io/husky/#/) and [lint-staged](https://github.com/okonet/lint-staged).
The style is also enforced with jobs that run on CI (Continuous Integration workflow) before merging a pull request.

There are some VSCode extensions that can help you write code while respecting the project's code style. These extensions have been listed in the `extensions.json` file, which will make VSCode suggest them to you in the extensions menu.

Other than that, write [clean code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) so it's easy to understand and comments are not necessary.
Here are some additional good practices that are encouraged in this project:

- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Inline `export` with expressions whenever possible

  ```js
  // Use this:
  export const name = 'Testify'

  // Instead of:
  const name = 'Testify'

  export {name}
  ```

- Organize imports so they are ordered, deduplicated and only the necessary ones remain (Pro Tip: use VSCode's "organize imports" command)
- Place class properties in the following order:
  - Class methods and properties (methods starting with `static`)
  - Instance methods and properties
- Sort by alphabetical order whenever possible
- [Avoid platform-dependent code](https://flight-manual.atom.io/hacking-atom/sections/cross-platform-compatibility/)

### Testing Style Guide

The test suite is the standard for a VSCode extension, using Mocha test framework and vscode test engine.
We are still trying to develop a good end-to-end suite of tests for the project and any help is appreciated.
Unit tests, however, are present in the project and should be extended as needed.

There are several ways to write a test and, in this project, we attempt to use a mix of [Given-When-Then (GWT)](https://martinfowler.com/bliki/GivenWhenThen.html) and [Arrange-Act-Assert (AAA)](https://xp123.com/articles/3a-arrange-act-assert/).
The goal is to provide as much context as possible in the test, through titles and meaningful variable and function names.
Here's an example of how it goes:

```js
// unit to be tested:
describe('parser', () => {
  // context, or "given"
  context('given a source code with a valid test', () => {
    // what is being tested, or "then"
    it('should find a test', () => {
      // arrange
      const testToken = 'it'
      const testTitle = 'a test'
      const sourceCode = `
        ${testToken}('${testTitle}', () => {
          const expected = 'value'

          const result = foo()

          expect(result).toEqual(expected)
        });
      `

      // act
      const result = parseSourceCode(sourceCode)

      // assert
      assert.equal(result.length, 1)
      assert.equal(result[0].title, testTitle)
      assert.equal(result[0].loc.identifierName, testToken)
    })
  })
})
```

### Documentation Style Guide

- Straightforward and important information should go in the [README](README.md)
- Any long, complex or niche information should go in the [Wiki](https://github.com/felixjb/testify/wiki)
