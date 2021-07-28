import { WorkspaceFolder } from "vscode";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export interface ITestRunnerInterface {
  name: string;
  path: string;
  terminalProvider: TerminalProvider;
  configurationProvider: ConfigurationProvider;

  runWatch(rootPath: WorkspaceFolder, fileName: string, testName: string): void;
  runTest(rootPath: WorkspaceFolder, fileName: string, testName: string): void;
  debugTest(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string
  ): void;
}
