import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {RunParams, TestParams, TestRunner} from './test-runner'

export class JestTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly executablePath: string = 'node_modules/.bin/jest',
    readonly entryPointPath: string = 'node_modules/jest/bin/jest.js'
  ) {
    super(configurationProvider, executablePath, entryPointPath)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      this.executablePath,
      fileName,
      `--testNamePattern="${testName}"`,
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
      program: `\${workspaceFolder}/${this.entryPointPath}`,
      args: [
        fileName,
        `--testNamePattern="${testName}"`,
        '--runInBand',
        ...this.configurationProvider.args
      ],
      ...this.configurationProvider.debugConfiguration
    })
  }
}
