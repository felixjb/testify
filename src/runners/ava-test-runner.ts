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

  public runTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    const environmentVariables = this.configurationProvider.environmentVariables
    const terminal = TerminalProvider.get({env: environmentVariables}, workspaceFolder)

    const additionalArguments = this.configurationProvider.additionalArguments
    const command = `${this.path} ${convertFilePathToWindows(
      fileName
    )} -m "${escapeQuotes(testName)}" ${additionalArguments}`

    terminal.sendText(command, true)
    terminal.show(true)
  }

  public debugTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    const skipFiles = this.configurationProvider.skipFiles
    const environmentVariables = this.configurationProvider.environmentVariables
    const additionalArguments = this.configurationProvider.additionalArguments

    debug.startDebugging(workspaceFolder, {
      skipFiles,
      console: 'integratedTerminal',
      env: environmentVariables,
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
        ...additionalArguments.split(' ')
      ],
      runtimeExecutable: join(workspaceFolder.uri.fsPath, this.path),
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
    )} -m "${escapeQuotes(testName)}" --watch ${additionalArguments}`

    terminal.sendText(command, true)
    terminal.show(true)
  }
}
