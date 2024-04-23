import {workspace, WorkspaceConfiguration, WorkspaceFolder} from 'vscode'

type env = {[key: string]: string | null | undefined}

export class ConfigurationProvider {
  private readonly configuration: WorkspaceConfiguration

  constructor(workspaceFolder: WorkspaceFolder) {
    this.configuration = workspace.getConfiguration('testify', workspaceFolder.uri)
  }

  get additionalArguments(): string {
    return this.configuration.get<string>('additionalArgs', '')
  }

  get environmentVariables(): env {
    return this.configuration.get<env>('envVars', {NODE_ENV: 'test'})
  }

  get skipFiles(): string[] {
    return this.configuration.get<string[]>('skipFiles', [])
  }

  get testRunnerPath(): string {
    return this.configuration.get<string>('testRunnerPath', '')
  }
}
