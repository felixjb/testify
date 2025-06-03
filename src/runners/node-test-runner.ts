import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TestParams} from '../utils/params'
import {
  convertFilePathToWindows,
  escapeQuotesAndSpecialCharacters,
  getNodePath
} from '../utils/utils'
import {RunParams, TestRunner} from './test-runner'

export class NodeTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    /** Must be the absolute path to the Node.js executable */
    readonly path: string = getNodePath() ?? ''
  ) {
    super(configurationProvider, path)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      this.path,
      '--test',
      watchOption,
      this.configurationProvider.additionalArguments,
      convertFilePathToWindows(fileName),
      `--test-name-pattern="${escapeQuotesAndSpecialCharacters(testName)}"`
    ].join(' ')

    this.runCommand(workspaceFolder, command)
  }

  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: '--watch'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    debug.startDebugging(workspaceFolder, {
      ...this.getCommonDebugConfig(workspaceFolder),
      program: null,
      runtimeExecutable: this.path,
      args: [
        ...this.configurationProvider.additionalArguments.split(' '),
        convertFilePathToWindows(fileName),
        `--test-name-pattern="${escapeQuotesAndSpecialCharacters(testName)}"`
      ]
    })
  }
}
