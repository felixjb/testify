import {join} from 'path'
import {debug, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {convertFilePathToWindows, escapeQuotes} from '../utils/utils'
import {TestRunner} from './test-runner'

// TODO: Make a more generic test runner class and extend it
export class MochaTestRunner implements TestRunner {
  constructor(
    private readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'mocha')
  ) {}

  public runTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    const environmentVariables = this.configurationProvider.environmentVariables
    const terminal = TerminalProvider.get({env: environmentVariables}, workspaceFolder)

    const additionalArguments = this.configurationProvider.additionalArguments
    const command = `${this.path} ${convertFilePathToWindows(
      fileName
    )} --fgrep="${escapeQuotes(testName)}" ${additionalArguments}`

    terminal.sendText(command, true)
    terminal.show(true)
  }

  public debugTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    const skipFiles = this.configurationProvider.skipFiles
    const additionalArguments = this.configurationProvider.additionalArguments
    const environmentVariables = this.configurationProvider.environmentVariables

    debug.startDebugging(workspaceFolder, {
      skipFiles,
      args: [
        convertFilePathToWindows(fileName),
        '--fgrep',
        escapeQuotes(testName),
        ...additionalArguments.split(' ')
      ],
      console: 'integratedTerminal',
      env: environmentVariables,
      name: 'Debug Test',
      program: join(workspaceFolder.uri.fsPath, this.path),
      request: 'launch',
      type: 'node'
    })
  }

  // TODO: Reuse the runTest method
  public watchTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    const environmentVariables = this.configurationProvider.environmentVariables
    const terminal = TerminalProvider.get({env: environmentVariables}, workspaceFolder)

    const additionalArguments = this.configurationProvider.additionalArguments
    const command = `${this.path} ${convertFilePathToWindows(
      fileName
    )} --fgrep="${escapeQuotes(testName)}" --watch ${additionalArguments}`

    terminal.sendText(command, true)
    terminal.show(true)
  }
}
