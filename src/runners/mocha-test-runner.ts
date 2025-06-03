import {join} from 'path'
import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TestParams} from '../utils/params'
import {convertFilePathToWindows, escapeQuotesAndSpecialCharacters} from '../utils/utils'
import {RunParams, TestRunner} from './test-runner'

export class MochaTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'mocha')
  ) {
    super(configurationProvider, path)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      this.path,
      convertFilePathToWindows(fileName),
      `--fgrep="${escapeQuotesAndSpecialCharacters(testName)}"`,
      watchOption,
      this.configurationProvider.additionalArguments
    ].join(' ')

    this.runCommand(workspaceFolder, command)
  }

  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: '--watch'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    debug.startDebugging(workspaceFolder, {
      ...this.getCommonDebugConfig(workspaceFolder),
      args: [
        convertFilePathToWindows(fileName),
        `--fgrep="${escapeQuotesAndSpecialCharacters(testName)}"`,
        ...this.configurationProvider.additionalArguments.split(' ')
      ]
    })
  }
}
