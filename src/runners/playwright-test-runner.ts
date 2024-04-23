import {join} from 'path'
import {debug, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {convertFilePathToWindows, escapeQuotes} from '../utils/utils'
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
    } test -g "${escapeQuotes(testName)}" ${additionalArguments} ${convertFilePathToWindows(fileName)}`

    terminal.sendText(command, true)
    terminal.show(true)
  }

  public debugTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    const additionalArguments = this.configurationProvider.additionalArguments
    const environmentVariables = this.configurationProvider.environmentVariables
    const skipFiles = this.configurationProvider.skipFiles

    debug.startDebugging(workspaceFolder, {
      skipFiles,
      args: [
        'test',
        '-g',
        escapeQuotes(testName),
        ...additionalArguments.split(' '),
        convertFilePathToWindows(fileName)
      ],
      console: 'integratedTerminal',
      env: {
        ...{PLAYWRIGHT_CHROMIUM_DEBUG_PORT: 9222, PWDEBUG: true},
        ...environmentVariables
      },
      name: 'Debug Test',
      program: join(workspaceFolder.uri.fsPath, this.path),
      request: 'launch',
      type: 'node'
    })
  }

  /**
   * Executes {@link runTest} method due to Playwright test runner not supporting "watch" yet.
   * https://github.com/microsoft/playwright/issues/7035
   */
  public watchTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void {
    this.runTest(workspaceFolder, fileName, testName)
  }
}
