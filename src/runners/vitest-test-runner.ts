import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {RunFileParms, RunParams, TestParams, TestRunner, WatchFileParms} from './test-runner'

export class VitestTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly executablePath: string = 'node_modules/.bin/vitest',
    readonly entryPointPath: string = 'node_modules/vitest/vitest.mjs'
  ) {
    super(configurationProvider, executablePath, entryPointPath)
  }

  public run({workspaceFolder, fileName, testName, watchOption = 'run'}: RunParams): void {
    const command = [
      this.executablePath,
      watchOption,
      fileName,
      `--testNamePattern="${testName}"`,
      ...this.configurationProvider.args
    ]
    this.runCommand(workspaceFolder, command)
  }

  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: 'watch'})
  }

  public runFile({workspaceFolder, fileName, watchOption = 'run'}: RunFileParms): void {
    const command = [this.executablePath, watchOption, fileName, ...this.configurationProvider.args]
    this.runCommand(workspaceFolder, command)
  }

  public watchFile({workspaceFolder, fileName}: WatchFileParms): void {
    this.runFile({workspaceFolder, fileName, watchOption: 'watch'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    debug.startDebugging(workspaceFolder, {
      program: `\${workspaceFolder}/${this.entryPointPath}`,
      args: [
        'run',
        fileName,
        `--testNamePattern="${testName}"`,
        '--no-file-parallelism',
        ...this.configurationProvider.args
      ],
      ...this.configurationProvider.debugConfiguration
    })
  }
}
