import {workspace, WorkspaceConfiguration, WorkspaceFolder} from 'vscode'

type env = {[key: string]: string | null | undefined}

export class ConfigurationProvider {
  private readonly configuration: WorkspaceConfiguration

  constructor(rootPath: WorkspaceFolder) {
    this.configuration = workspace.getConfiguration('testify', rootPath.uri)
  }

  get additionalArguments(): string {
    const DEFAULT = ''
    return this.configuration.get('additionalArgs', DEFAULT)
  }

  get environmentVariables(): env {
    const DEFAULT = {
      NODE_ENV: 'test'
    }
    return this.configuration.get('envVars', DEFAULT)
  }

  get skipFiles(): string[] {
    const DEFAULT: string[] = []
    return this.configuration.get('skipFiles', DEFAULT)
  }

  get testRunnerPath(): string {
    const DEFAULT = ''
    return this.configuration.get('testRunnerPath', DEFAULT)
  }
}
