import {
  Terminal,
  TerminalOptions,
  ThemeColor,
  ThemeIcon,
  WorkspaceFolder,
  commands,
  window
} from 'vscode'
import {env} from './configuration-provider'

export class TerminalProvider {
  private static activeTerminal: Terminal

  public static executeCommand({
    workspaceFolder,
    command,
    options: {autoClear, env}
  }: {
    workspaceFolder: WorkspaceFolder
    command: string
    options: {autoClear: boolean; env: env}
  }): void {
    if (autoClear) {
      commands.executeCommand('workbench.action.terminal.clear')
    }

    const terminal = this.get(workspaceFolder, {env: env})
    terminal.sendText(command, true)
    terminal.show(true)
  }

  private static get(workspaceFolder: WorkspaceFolder, terminalOptions: TerminalOptions): Terminal {
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
