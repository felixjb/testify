import {WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {StateProvider} from '../providers/state-provider'
import {TerminalProvider} from '../providers/terminal-provider'

export type TestParams = {
  workspaceFolder: WorkspaceFolder
  fileName: string
  testName: string
}

export type RunParams = TestParams & {watchOption?: string}

export type RunFileParms = Omit<RunParams, 'testName'>

export type WatchFileParms = Omit<TestParams, 'testName'>

/**
 * @class TestRunner
 * @description Abstract class for all test runners. Provides common functionality for running and
 * debugging tests.
 */
export abstract class TestRunner {
  /**
   * @param configurationProvider - The configuration provider to use for test runner settings.
   * @param executablePath - The relative path (to the workspace folder) to the test runner
   * executable. This is typically the path to the test runner script in `node_modules/.bin`. Some
   * test runners may use a shell script, while others may use a JavaScript file that can be
   * executed by Node.js. It is used to run the test runner in the terminal.
   * @param entryPointPath - The relative path (to the workspace folder) to the test runner entry
   * point. It must be a JavaScript file that can be executed by Node.js. It is usually the main
   * script of the test runner package, such as `node_modules/vitest/vitest.mjs`, and it invokes
   * the test runner with the appropriate arguments. Beware that some test runners may have a
   * wrapper that processes the arguments before passing them to the actual test runner.
   * Is used to start the test runner in debug mode.
   */
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly executablePath: string,
    readonly entryPointPath: string
  ) {}

  public abstract run(params: RunParams): void

  public abstract watch(params: TestParams): void

  public abstract debug(params: TestParams): void

  public abstract runFile(params: RunFileParms): void

  public abstract watchFile(params: WatchFileParms): void

  public rerunLastCommand(workspaceFolder: WorkspaceFolder): void {
    const lastCommand = StateProvider.lastCommand
    if (!lastCommand || lastCommand.length === 0) {
      return
    }

    this.runCommand(workspaceFolder, lastCommand)
  }

  protected runCommand(workspaceFolder: WorkspaceFolder, command: string[]): void {
    StateProvider.lastCommand = command

    TerminalProvider.executeCommand({
      workspaceFolder,
      command: command.join(' '),
      options: {
        autoClear: this.configurationProvider.autoClear,
        env: this.configurationProvider.env
      }
    })
  }
}
