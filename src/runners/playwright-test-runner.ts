import {join} from 'path'
import {commands, debug, WorkspaceFolder} from 'vscode'
import {COMMON_DEBUG_CONFIG} from '../constants/debug-configuration'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {convertFilePathToWindows, escapeQuotesAndSpecialCharacters} from '../utils/utils'
import {TestRunner} from './test-runner'

export class PlaywrightTestRunner implements TestRunner {
  constructor(
    private readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'playwright')
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
    const command = `${watchOption} ${this.path} test -g "${escapeQuotesAndSpecialCharacters(testName)}" ${additionalArguments} ${convertFilePathToWindows(fileName)}`

    if (this.configurationProvider.autoClear) {
      commands.executeCommand('workbench.action.terminal.clear')
    }

    terminal.sendText(command, true)
    terminal.show(true)
  }

  /**
   * Playwright currently does not officially support "watch" yet, so we are using the environment
   * variable `PWTEST_WATCH=1` to simulate the watch mode.
   *
   * @see https://github.com/microsoft/playwright/issues/21960#issuecomment-1483604692
   */
  public watchTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    this.runTest(workspaceFolder, fileName, testName, 'PWTEST_WATCH=1')
  }

  public debugTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    debug.startDebugging(workspaceFolder, {
      ...COMMON_DEBUG_CONFIG,
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
      program: join(workspaceFolder.uri.fsPath, this.path),
      skipFiles: this.configurationProvider.skipFiles
    })
  }
}
