import {join} from 'path'
import {DebugConfiguration, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {TestParams} from '../utils/params'

export type RunParams = TestParams & {watchOption?: string}

export abstract class TestRunner {
  constructor(
    readonly configurationProvider: ConfigurationProvider,
    readonly path: string
  ) {}

  public abstract run(params: RunParams): void

  public abstract watch(params: TestParams): void

  public abstract debug(params: TestParams): void

  protected runCommand(workspaceFolder: WorkspaceFolder, command: string): void {
    TerminalProvider.executeCommand({
      workspaceFolder,
      command,
      options: {
        autoClear: this.configurationProvider.autoClear,
        environmentVariables: this.configurationProvider.environmentVariables
      }
    })
  }

  protected getCommonDebugConfig(workspaceFolder: WorkspaceFolder): DebugConfiguration {
    return {
      name: 'Testify: Debug Test',
      type: 'node',
      request: 'launch',
      console: 'internalConsole',
      internalConsoleOptions: 'openOnSessionStart',
      outputCapture: 'std',
      autoAttachChildProcesses: true,
      smartStep: true,
      env: this.configurationProvider.environmentVariables,
      program: join(workspaceFolder.uri.fsPath, this.path),
      skipFiles: this.configurationProvider.skipFiles
    }
  }
}
