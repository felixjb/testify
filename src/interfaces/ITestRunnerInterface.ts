import { WorkspaceFolder } from "vscode";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export interface ITestRunnerInterface {
  name: string;
  binPath: string;
  rootPath: WorkspaceFolder;
  terminalProvider: TerminalProvider;
  configurationProvider: ConfigurationProvider;

  runTest(testName: string, fileName: string): void;
  debugTest(testName: string, fileName: string): void;
}
