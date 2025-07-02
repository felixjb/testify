import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {RunFileParms, RunParams, TestParams, TestRunner, WatchFileParms} from './test-runner'

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
    ]
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

  public runFile({workspaceFolder, fileName, watchOption = ''}: RunFileParms): void {
    const command = [watchOption, this.executablePath, ...this.configurationProvider.args, fileName]
    this.runCommand(workspaceFolder, command)
  }

  /**
   * Playwright currently does not officially support "watch" yet, so we are using the environment
   * variable `PWTEST_WATCH=1` to simulate the watch mode.
   *
   * @see https://github.com/microsoft/playwright/issues/21960#issuecomment-1483604692
   */
  public watchFile({workspaceFolder, fileName}: WatchFileParms): void {
    this.runFile({workspaceFolder, fileName, watchOption: 'PWTEST_WATCH=1'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    const configuration = {
      program: `\${workspaceFolder}/${this.entryPointPath}`,
      env: {
        PLAYWRIGHT_CHROMIUM_DEBUG_PORT: 9222,
        PWDEBUG: true,
        ...this.configurationProvider.env
      },
      args: ['test', '-g', testName, ...this.configurationProvider.args, fileName],
      ...this.configurationProvider.debugConfiguration
    }
    debug.startDebugging(workspaceFolder, configuration)
  }
}
