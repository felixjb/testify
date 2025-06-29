import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {RunParams, TestParams, TestRunner} from './test-runner'

export class VitestTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly executablePath: string = 'node_modules/.bin/vitest',
    readonly entryPointPath: string = 'node_modules/vitest/vitest.mjs'
  ) {
    super(configurationProvider, executablePath, entryPointPath)
  }

  public run({workspaceFolder, fileName, testName, watchOption}: RunParams): void {
    const mode = watchOption ?? 'run'
    const command = [
      this.executablePath,
      mode,
      fileName,
      `--testNamePattern="${testName}"`,
      ...this.configurationProvider.args
    ].join(' ')

    this.runCommand(workspaceFolder, command)
  }

  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: 'watch'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    debug.startDebugging(workspaceFolder, {
      ...this.getCommonDebugConfig(),
      args: [
        'run',
        fileName,
        `--testNamePattern="${testName}"`,
        '--no-file-parallelism',
        ...this.configurationProvider.args
      ]
    })
  }
}
