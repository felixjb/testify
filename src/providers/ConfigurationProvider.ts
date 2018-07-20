import { workspace, WorkspaceConfiguration } from "vscode";

export class ConfigurationProvider {
  public configuration: WorkspaceConfiguration = null;

  constructor() {
    this.configuration = workspace.getConfiguration("javascript-test-runner");
  }

  get environmentVariables(): {} {
    return this.configuration.get("envVars");
  }

  get additionalArguments(): string {
    return this.configuration.get("additionalArgs");
  }
}
