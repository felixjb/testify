import { CodeLens, Range } from "vscode";

export default class TestDebugRunnerCodeLens extends CodeLens {
  constructor(
    rootPath: string,
    fileName: string,
    testName: string,
    range: Range
  ) {
    super(range, {
      arguments: [rootPath, fileName, testName],
      command: "javascript-test-runner.debug.test",
      title: "Debug Test"
    });
  }
}
