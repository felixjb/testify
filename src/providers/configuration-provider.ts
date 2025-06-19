import shell from 'shell-quote'
import {DebugConfiguration, workspace, WorkspaceConfiguration, WorkspaceFolder} from 'vscode'
import {toForwardSlashPath} from '../utils/utils'

export type env = {[key: string]: string | null | undefined}

export class ConfigurationProvider {
  private readonly configuration: WorkspaceConfiguration

  constructor(workspaceFolder: WorkspaceFolder) {
    this.configuration = workspace.getConfiguration('testify', workspaceFolder.uri)
  }

  get executablePath(): string {
    const value =
      this.configuration.get<string>('executablePath') ??
      this.configuration.get<string>('testRunnerPath') ?? // Legacy support
      ''
    return toForwardSlashPath(value.trim())
  }

  get entryPointPath(): string {
    const value = this.configuration.get<string>('entryPointPath', '')
    return toForwardSlashPath(value.trim())
  }

  get args(): string[] {
    const args = this.configuration
      .get<string[]>('args', [])
      .map(arg => arg.trim())
      .filter(Boolean)
    if (args.length > 0) return args

    const additionalArgs = this.configuration.get<string>('additionalArgs', '')
    return shell
      .parse(additionalArgs)
      .map(arg => arg.toString().trim())
      .filter(Boolean)
  }

  get debugConfiguration(): DebugConfiguration {
    const value = this.configuration.get<DebugConfiguration>('debugConfiguration')
    return {
      name: 'Testify: Debug Test',
      type: 'node',
      request: 'launch',
      console: 'internalConsole',
      internalConsoleOptions: 'openOnSessionStart',
      outputCapture: 'std',
      autoAttachChildProcesses: true,
      smartStep: true,
      env: this.env,
      skipFiles: this.skipFiles,
      ...value
    }
  }

  get env(): env {
    const legacy = this.configuration.get<env>('envVars', {})
    return this.configuration.get<env>('env', legacy)
  }

  get skipFiles(): string[] {
    return this.configuration.get<string[]>('skipFiles', [])
  }

  get excludeFiles(): string[] {
    const legacy = this.configuration.get<string[]>('excludePatterns', [])
    return this.configuration.get<string[]>('excludeFiles', legacy)
  }

  get autoClear(): boolean {
    return this.configuration.get<boolean>('autoClear', true)
  }
}
