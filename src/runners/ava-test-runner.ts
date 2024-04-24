import {join} from 'path'
import {debug, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {convertFilePathToWindows, escapeQuotes} from '../utils/utils'
import {TestRunner} from './test-runner'

// TODO: Make a more generic test runner class and extend it
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
    const command = `${this.path} ${convertFilePathToWindows(
      fileName
    )} -m "${escapeQuotes(testName)}" ${additionalArguments} ${watchOption}`

    terminal.sendText(command, true)
    terminal.show(true)
  }

  public watchTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    this.runTest(workspaceFolder, fileName, testName, '--watch')
  }

  public debugTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    debug.startDebugging(workspaceFolder, {
      console: 'integratedTerminal',
      env: this.configurationProvider.environmentVariables,
      name: 'Debug Test',
      outputCapture: 'std',
      port: 9229,
      request: 'launch',
      runtimeArgs: [
        'debug',
        '--break',
        '--serial',
        convertFilePathToWindows(fileName),
        `--match="${escapeQuotes(testName)}"`,
        ...this.configurationProvider.additionalArguments.split(' ')
      ],
      runtimeExecutable: join(workspaceFolder.uri.fsPath, this.path),
      type: 'node',
      skipFiles: this.configurationProvider.skipFiles
    })
  }
}
