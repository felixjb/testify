import { Terminal, TerminalOptions, window, WorkspaceFolder } from "vscode";

export class TerminalProvider {
  private activeTerminal: Terminal = null;

  public get(
    terminalOptions: TerminalOptions,
    rootPath: WorkspaceFolder
  ): Terminal {
    if (this.activeTerminal) {
      this.activeTerminal.dispose();
    }

    this.activeTerminal = window.createTerminal(terminalOptions);
    this.activeTerminal.sendText(`cd ${rootPath.uri.fsPath}`, true);

    return this.activeTerminal;
  }
}
