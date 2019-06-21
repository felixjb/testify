import { workspace, WorkspaceConfiguration, WorkspaceFolder } from "vscode";

export class ConfigurationProvider {
  public configuration: WorkspaceConfiguration = null;

  constructor(rootPath: WorkspaceFolder) {
    this.configuration = workspace.getConfiguration("testify", rootPath.uri);
  }

  get environmentVariables(): {} {
    return this.configuration.get("envVars");
  }

  get additionalArguments(): string {
    return this.configuration.get("additionalArgs");
  }
}
