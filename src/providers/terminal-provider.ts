import {Terminal, TerminalOptions, ThemeColor, ThemeIcon, WorkspaceFolder, window} from 'vscode'

export class TerminalProvider {
  private static activeTerminal: Terminal

  private constructor() {}

  public static get(terminalOptions: TerminalOptions, workspaceFolder: WorkspaceFolder): Terminal {
    if (!TerminalProvider.activeTerminal || TerminalProvider.activeTerminal?.exitStatus) {
      TerminalProvider.activeTerminal = window.createTerminal({
        ...terminalOptions,
        cwd: workspaceFolder.uri.fsPath,
        name: 'Testify',
        iconPath: new ThemeIcon('beaker', new ThemeColor('terminal.ansiGreen')),
        color: new ThemeColor('terminal.ansiGreen')
      })
    }

    return TerminalProvider.activeTerminal
  }
}
