import {join} from 'path'
import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TestParams} from '../utils/params'
import {convertFilePathToWindows, escapeQuotesAndSpecialCharacters} from '../utils/utils'
import {RunParams, TestRunner} from './test-runner'

export class AvaTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'ava')
  ) {
    super(configurationProvider, path)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      this.path,
      convertFilePathToWindows(fileName),
      `-m "${escapeQuotesAndSpecialCharacters(testName)}"`,
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
        'debug',
        '--break',
        '--serial',
        convertFilePathToWindows(fileName),
        `--match="${escapeQuotesAndSpecialCharacters(testName)}"`,
        ...this.configurationProvider.additionalArguments.split(' ')
      ]
    })
  }
}
