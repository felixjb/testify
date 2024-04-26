import {join} from 'path'
import {commands, debug, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {convertFilePathToWindows, escapeQuotesAndSpecialCharacters} from '../utils/utils'
import {TestRunner} from './test-runner'

// TODO: Make a more generic test runner class and extend it
export class PlaywrightTestRunner implements TestRunner {
  constructor(
    private readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'playwright')
  ) {}

  public runTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    const environmentVariables = this.configurationProvider.environmentVariables
    const terminal = TerminalProvider.get({env: environmentVariables}, workspaceFolder)

    const additionalArguments = this.configurationProvider.additionalArguments
    const command = `${
      this.path
    } test -g "${escapeQuotesAndSpecialCharacters(testName)}" ${additionalArguments} ${convertFilePathToWindows(fileName)}`

    if (this.configurationProvider.autoClear) {
      commands.executeCommand('workbench.action.terminal.clear')
    }

    terminal.sendText(command, true)
    terminal.show(true)
  }

  /**
   * Executes {@link runTest} method due to Playwright test runner not supporting "watch" yet.
   * https://github.com/microsoft/playwright/issues/7035
   */
  public watchTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    this.runTest(workspaceFolder, fileName, testName)
  }

  public debugTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    debug.startDebugging(workspaceFolder, {
      args: [
        'test',
        '-g',
        escapeQuotesAndSpecialCharacters(testName),
        ...this.configurationProvider.additionalArguments.split(' '),
        convertFilePathToWindows(fileName)
      ],
      env: {
        ...{PLAYWRIGHT_CHROMIUM_DEBUG_PORT: 9222, PWDEBUG: true},
        ...this.configurationProvider.environmentVariables
      },
      name: 'Debug Test',
      console: 'integratedTerminal',
      program: join(workspaceFolder.uri.fsPath, this.path),
      request: 'launch',
      type: 'node',
      skipFiles: this.configurationProvider.skipFiles
    })
  }
}
