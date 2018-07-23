import {
  window,
  workspace,
  WorkspaceFolder,
  WorkspaceFoldersChangeEvent
} from "vscode";

import { IWorkspaceConfig } from "../interfaces/IWorkspaceConfig";
import { parseConfig } from "../parser/configParser";
import TestRunnerCodeLensProvider from "../providers/TestRunnerCodeLensProvider";

export class PluginConfig {
  private testFrameworkConfig: { [key: number]: IWorkspaceConfig } = {};

  constructor() {
    // Register workspace folder change listener to detect added/removed workspaces during runtime
    workspace.onDidChangeWorkspaceFolders(this.onWorkspaceChanged);
    // Check existing workspace for mocha/jest dependency
    if (workspace.workspaceFolders) {
      const p = [];
      workspace.workspaceFolders.forEach(ws => {
        p.push(this.parseWorkspaceConfig(ws));
      });
      Promise.all(p)
        .then(() => this.refreshCodeLenseOnActiveEditor())
        .catch(() => this.refreshCodeLenseOnActiveEditor());
    }
  }

  public getWorkspaceConfig(ws: WorkspaceFolder) {
    return this.testFrameworkConfig[ws.index];
  }

  private async parseWorkspaceConfig(ws: WorkspaceFolder) {
    const c = await parseConfig(ws);
    this.testFrameworkConfig[ws.index] = c;
  }

  private onWorkspaceChanged(event: WorkspaceFoldersChangeEvent) {
    window.showInformationMessage("Worspace was changed " + event);
    if (event.removed) {
      event.removed.forEach(ws => {
        delete this.testFrameworkConfig[ws.index];
      });
    }
    if (event.added) {
      event.added.forEach(ws => {
        this.parseWorkspaceConfig(ws);
      });
    }
  }

  private refreshCodeLenseOnActiveEditor() {
    if (window.activeTextEditor) {
      new TestRunnerCodeLensProvider(this).provideCodeLenses(
        window.activeTextEditor.document
      );
    }
  }
}
