import { join } from "path";
import { debug, WorkspaceFolder } from "vscode";
import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

// TODO: Make a more generic test runner class and extend it
export class MochaTestRunner implements ITestRunnerInterface {
  public name: string = "mocha";
  public path: string = join("node_modules", ".bin", this.name);
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  constructor(
    configurationProvider: ConfigurationProvider,
    terminalProvider: TerminalProvider,
    path?: string
  ) {
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;

    if (path) {
      this.path = path;
    }
  }

  public runWatch(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string
  ) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables =
      this.configurationProvider.environmentVariables;

    const command = `${this.path} ${fileName} --fgrep="${testName}" --watch ${additionalArguments}`;

    const terminal = this.terminalProvider.get(
      { env: environmentVariables },
      rootPath
    );

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public runTest(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string
  ) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables =
      this.configurationProvider.environmentVariables;

    const command = `${this.path} ${fileName} --fgrep="${testName}" ${additionalArguments}`;

    const terminal = this.terminalProvider.get(
      { env: environmentVariables },
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
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables =
      this.configurationProvider.environmentVariables;
    const skipFiles = this.configurationProvider.skipFiles;

    debug.startDebugging(rootPath, {
      args: [fileName, "--fgrep", testName, ...additionalArguments.split(" ")],
      console: "integratedTerminal",
      env: environmentVariables,
      name: "Debug Test",
      program: join(rootPath.uri.fsPath, this.path),
      request: "launch",
      skipFiles,
      type: "node"
    });
  }
}
