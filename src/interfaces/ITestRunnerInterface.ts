import { WorkspaceFolder } from "vscode";

export interface ITestRunnerInterface {
  runTest(rootPath: WorkspaceFolder, fileName: string, testName: string): void;

  debugTest(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string
  ): void;
}
