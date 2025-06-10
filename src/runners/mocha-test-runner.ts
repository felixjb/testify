import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {RunParams, TestParams, TestRunner} from './test-runner'

export class MochaTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly executablePath: string = 'node_modules/.bin/mocha',
    readonly entryPointPath: string = 'node_modules/mocha/bin/mocha.js'
  ) {
    super(configurationProvider, executablePath, entryPointPath)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      this.executablePath,
      fileName,
      `--fgrep="${testName}"`,
      watchOption,
      ...this.configurationProvider.args
    ].join(' ')

    this.runCommand(workspaceFolder, command)
  }

  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: '--watch'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    debug.startDebugging(workspaceFolder, {
      ...this.getCommonDebugConfig(),
      args: [fileName, `--fgrep="${testName}"`, ...this.configurationProvider.args]
    })
  }
}
