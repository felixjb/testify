import { WorkspaceFolder } from "vscode";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export interface ITestRunnerOptions {
  rootPath: WorkspaceFolder;
  terminalProvider: TerminalProvider;
  configurationProvider: ConfigurationProvider;
}
