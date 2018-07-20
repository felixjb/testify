import { debug, WorkspaceFolder } from "vscode";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ITestRunnerOptions } from "../interfaces/ITestRunnerOptions";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export class MochaTestRunner implements ITestRunnerInterface {
  public name: string = "mocha";
  public rootPath: WorkspaceFolder = null;
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  get binPath(): string {
    return `${this.rootPath}/node_modules/.bin/mocha`;
  }

  constructor({
    rootPath,
    terminalProvider,
    configurationProvider
  }: ITestRunnerOptions) {
    this.rootPath = rootPath;
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;
  }

  public runTest(testName: string, fileName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables = this.configurationProvider
      .environmentVariables;

    const command = `${
      this.binPath
    } ${fileName} --grep="${testName}" ${additionalArguments}`;

    const terminal = this.terminalProvider.get({
      env: environmentVariables
    });

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(testName: string, fileName: string) {
    const additionalArgs = this.configurationProvider.additionalArguments;
    const environmentVariables = this.configurationProvider
      .environmentVariables;

    debug.startDebugging(this.rootPath, {
      args: [
        fileName,
        `--grep "${testName}"`,
        "--no-timeout",
        ...additionalArgs.split(" ")
      ],
      console: "integratedTerminal",
      env: environmentVariables,
      name: "Debug Test",
      program: this.binPath,
      request: "launch",
      type: "node"
    });
  }
}
