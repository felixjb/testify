import {join} from 'path'
import {commands, debug, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {convertFilePathToWindows, escapeQuotesAndSpecialCharacters} from '../utils/utils'
import {TestRunner} from './test-runner'

// TODO: Make a more generic test runner class and extend it
export class MochaTestRunner implements TestRunner {
  constructor(
    private readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'mocha')
  ) {}

  public runTest(
    workspaceFolder: WorkspaceFolder,
    fileName: string,
    testName: string,
    watchOption: string = ''
  ): void {
    const environmentVariables = this.configurationProvider.environmentVariables
    const terminal = TerminalProvider.get({env: environmentVariables}, workspaceFolder)

    const additionalArguments = this.configurationProvider.additionalArguments
    const command = `${this.path} ${convertFilePathToWindows(
      fileName
    )} --fgrep="${escapeQuotesAndSpecialCharacters(testName)}" ${additionalArguments} ${watchOption}`

    if (this.configurationProvider.autoClear) {
      commands.executeCommand('workbench.action.terminal.clear')
    }

    terminal.sendText(command, true)
    terminal.show(true)
  }

  public watchTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    this.runTest(workspaceFolder, fileName, testName, '--watch')
  }

  public debugTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    debug.startDebugging(workspaceFolder, {
      args: [
        convertFilePathToWindows(fileName),
        '--fgrep',
        escapeQuotesAndSpecialCharacters(testName),
        ...this.configurationProvider.additionalArguments.split(' ')
      ],
      console: 'integratedTerminal',
      env: this.configurationProvider.environmentVariables,
      name: 'Debug Test',
      program: join(workspaceFolder.uri.fsPath, this.path),
      request: 'launch',
      type: 'node',
      skipFiles: this.configurationProvider.skipFiles
    })
  }
}
