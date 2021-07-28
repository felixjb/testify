import { CodeLens, Range, WorkspaceFolder } from "vscode";

export default class TestWatchRunnerCodeLens extends CodeLens {
  constructor(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string,
    range: Range
  ) {
    super(range, {
      arguments: [rootPath, fileName, testName],
      command: "testify.run.watch",
      title: "Watch Test"
    });
  }
}
