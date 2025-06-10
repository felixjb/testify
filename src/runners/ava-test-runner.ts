import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {RunParams, TestParams, TestRunner} from './test-runner'

export class AvaTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly executablePath: string = 'node_modules/.bin/ava',
    readonly entryPointPath: string = 'node_modules/ava/entrypoints/cli.mjs'
  ) {
    super(configurationProvider, executablePath, entryPointPath)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      this.executablePath,
      fileName,
      `--match="${testName}"`,
      watchOption,
      this.configurationProvider.args
    ].join(' ')

    this.runCommand(workspaceFolder, command)
  }

  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: '--watch'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    debug.startDebugging(workspaceFolder, {
      ...this.getCommonDebugConfig(),
      args: [
        'debug',
        '--break',
        '--serial',
        fileName,
        `--match="${testName}"`,
        ...this.configurationProvider.args.split(' ')
      ]
    })
  }
}
