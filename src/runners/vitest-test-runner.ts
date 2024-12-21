import {join} from 'path'
import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TestParams} from '../utils/params'
import {convertFilePathToWindows, escapeQuotesAndSpecialCharacters} from '../utils/utils'
import {RunParams, TestRunner} from './test-runner'

export class VitestTestRunner extends TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly path: string = join('node_modules', '.bin', 'vitest')
  ) {
    super(configurationProvider, path)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const mode = watchOption ? 'watch' : 'run'
    const command = [
      this.path,
      mode,
      convertFilePathToWindows(fileName),
      `--testNamePattern="${escapeQuotesAndSpecialCharacters(testName)}"`,
      this.configurationProvider.additionalArguments
    ].join(' ')

    this.runCommand(workspaceFolder, command)
  }

  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: 'watch'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    debug.startDebugging(workspaceFolder, {
      ...this.getCommonDebugConfig(workspaceFolder),
      args: [
        'run',
        convertFilePathToWindows(fileName),
        '--testNamePattern',
        escapeQuotesAndSpecialCharacters(testName),
        '--no-file-parallelism',
        ...this.configurationProvider.additionalArguments.split(' ')
      ]
    })
  }
}
