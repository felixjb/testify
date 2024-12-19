import {join} from 'path'
import {commands, debug, WorkspaceFolder} from 'vscode'
import {COMMON_DEBUG_CONFIG} from '../constants/debug-configuration'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {convertFilePathToWindows, escapeQuotesAndSpecialCharacters} from '../utils/utils'
import {TestRunner} from './test-runner'

export class AvaTestRunner implements TestRunner {
  constructor(
    private readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'ava')
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
    const command = `${this.path} ${convertFilePathToWindows(fileName)} -m "${escapeQuotesAndSpecialCharacters(testName)}" ${additionalArguments} ${watchOption}`

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
      ...COMMON_DEBUG_CONFIG,
      args: [
        'debug',
        '--break',
        '--serial',
        convertFilePathToWindows(fileName),
        `--match="${escapeQuotesAndSpecialCharacters(testName)}"`,
        ...this.configurationProvider.additionalArguments.split(' ')
      ],
      env: this.configurationProvider.environmentVariables,
      runtimeExecutable: join(workspaceFolder.uri.fsPath, this.path),
      skipFiles: this.configurationProvider.skipFiles
    })
  }
}
