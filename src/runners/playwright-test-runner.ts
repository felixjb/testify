import {join} from 'path'
import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TestParams} from '../utils/params'
import {convertFilePathToWindows, escapeQuotesAndSpecialCharacters} from '../utils/utils'
import {RunParams, TestRunner} from './test-runner'

export class PlaywrightTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'playwright')
  ) {
    super(configurationProvider, path)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      watchOption,
      this.path,
      'test',
      '-g',
      `"${escapeQuotesAndSpecialCharacters(testName)}"`,
      this.configurationProvider.additionalArguments,
      convertFilePathToWindows(fileName)
    ].join(' ')

    this.runCommand(workspaceFolder, command)
  }

  /**
   * Playwright currently does not officially support "watch" yet, so we are using the environment
   * variable `PWTEST_WATCH=1` to simulate the watch mode.
   *
   * @see https://github.com/microsoft/playwright/issues/21960#issuecomment-1483604692
   */
  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: 'PWTEST_WATCH=1'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    debug.startDebugging(workspaceFolder, {
      ...this.getCommonDebugConfig(workspaceFolder),
      env: {
        ...{PLAYWRIGHT_CHROMIUM_DEBUG_PORT: 9222, PWDEBUG: true},
        ...this.configurationProvider.environmentVariables
      },
      args: [
        'test',
        '-g',
        escapeQuotesAndSpecialCharacters(testName),
        ...this.configurationProvider.additionalArguments.split(' '),
        convertFilePathToWindows(fileName)
      ]
    })
  }
}
