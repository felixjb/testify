import * as path from "path";
import { debug, WorkspaceFolder } from "vscode";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { TerminalProvider } from "../providers/TerminalProvider";

export class JestTestRunner implements ITestRunnerInterface {
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
    // We force slash instead of backslash for Windows
    const cleanedFileName = fileName.replace(/\\/g, "/");

    const command = `${
      this.executable
    } ${cleanedFileName} --testNamePattern="${testName}" ${this.convertArguments(
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
    // We force slash instead of backslash for Windows
    const cleanedFileName = fileName.replace(/\\/g, "/");

    debug.startDebugging(rootPath, {
      args: [
        cleanedFileName,
        `--testNamePattern`,
        testName,
        "--runInBand",
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
   *
   * @param args
   */
  private convertArguments(args: any) {
    if (args instanceof Array) {
      return args;
    }
    return [args];
  }
}
