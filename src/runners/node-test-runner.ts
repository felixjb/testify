import {debug} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {RunFileParms, RunParams, TestParams, TestRunner, WatchFileParms} from './test-runner'

const DUMMY_PATH = 'not/used/node-test-runner.js'

export class NodeTestRunner extends TestRunner {
  /**
   * This is an inherited parameter that is not used for the Node.js test runner,
   * but is required for the abstract class. It can be set to any value, as it is
   * not used in this implementation.
   *
   * @override
   * @see {@link TestRunner.entryPointPath}
   */
  readonly entryPointPath: string = DUMMY_PATH

  /**
   * @param configurationProvider - The configuration provider to use for test runner settings.
   * @param executablePath - Must be the the absolute path to the Node.js executable. Since the host
   * can have multiple versions of Node.js installed, sometimes with version managers like `nvm`, it
   * is important to specify the exact Node.js executable to use for running the tests.
   */
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly executablePath: string
  ) {
    super(configurationProvider, executablePath, DUMMY_PATH)
  }

  public run({workspaceFolder, fileName, testName, watchOption = ''}: RunParams): void {
    const command = [
      this.executablePath,
      '--test',
      watchOption,
      ...this.configurationProvider.args,
      fileName,
      `--test-name-pattern="${testName}"`
    ]
    this.runCommand(workspaceFolder, command)
  }

  public watch({workspaceFolder, fileName, testName}: TestParams): void {
    this.run({workspaceFolder, fileName, testName, watchOption: '--watch'})
  }

  public runFile({workspaceFolder, fileName, watchOption = ''}: RunFileParms): void {
    const command = [
      this.executablePath,
      '--test',
      watchOption,
      fileName,
      ...this.configurationProvider.args
    ]
    this.runCommand(workspaceFolder, command)
  }

  public watchFile({workspaceFolder, fileName}: WatchFileParms): void {
    this.runFile({workspaceFolder, fileName, watchOption: '--watch'})
  }

  public debug({workspaceFolder, fileName, testName}: TestParams): void {
    const configuration = {
      program: null,
      // Needed for specifing the Node.js version as the host may have multiple versions installed
      runtimeExecutable: this.executablePath,
      args: [...this.configurationProvider.args, fileName, `--test-name-pattern="${testName}"`],
      ...this.configurationProvider.debugConfiguration
    }
    debug.startDebugging(workspaceFolder, configuration)
  }
}
