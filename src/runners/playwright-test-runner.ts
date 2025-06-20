import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {RunParams, TestParams, TestRunner} from './test-runner'

export class PlaywrightTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly executablePath: string = 'node_modules/.bin/playwright',
    readonly entryPointPath: string = 'node_modules/@playwright/test/cli.js'
  ) {
    super(configurationProvider, executablePath, entryPointPath)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      watchOption,
      this.executablePath,
      'test',
      '-g',
      `"${testName}"`,
      ...this.configurationProvider.args,
      fileName
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
      ...this.getCommonDebugConfig(),
      env: {
        PLAYWRIGHT_CHROMIUM_DEBUG_PORT: 9222,
        PWDEBUG: true,
        ...this.configurationProvider.env
      },
      args: ['test', '-g', testName, ...this.configurationProvider.args, fileName]
    })
  }
}
