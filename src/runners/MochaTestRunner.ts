import * as path from "path";
import { debug, WorkspaceFolder } from "vscode";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { TerminalProvider } from "../providers/TerminalProvider";

export class MochaTestRunner implements ITestRunnerInterface {
  private terminalProvider: TerminalProvider;
  private executable: string;
  private additionalArguments: string[];
  private environmentVariables: { [key: string]: string };

  constructor(
    terminalProvider: TerminalProvider,
    executable: string,
    additionalArguments: string[],
    environmentVariables: { [key: string]: string }
  ) {
    this.terminalProvider = terminalProvider;
    this.executable = executable;
    this.additionalArguments = additionalArguments;
    this.environmentVariables = environmentVariables;
  }

  public runTest(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string
  ) {
    const command = `${
      this.executable
    } ${fileName} --grep="${testName}" ${this.convertArguments(
      this.additionalArguments
    ).join(" ")}`;

    const terminal = this.terminalProvider.get(
      { env: this.environmentVariables },
      rootPath
    );

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string
  ) {
    debug.startDebugging(rootPath, {
      args: [
        fileName,
        "--grep",
        testName,
        "--no-timeout",
        ...this.convertArguments(this.additionalArguments)
      ],
      console: "integratedTerminal",
      env: this.environmentVariables,
      name: "Debug Test",
      program: path.join(rootPath.uri.fsPath, this.executable),
      request: "launch",
      type: "node"
    });
  }

  /**
   * Convert legacy arguments to array
   * @param args
   */
  private convertArguments(args: any) {
    if (args instanceof Array) {
      return args;
    }
    return [args];
  }
}
