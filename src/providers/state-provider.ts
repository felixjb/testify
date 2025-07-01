import {ExtensionContext} from 'vscode'

export class StateProvider {
  private static context: ExtensionContext

  public static setContext(context: ExtensionContext): void {
    StateProvider.context = context
  }

  static get lastVersion(): string | undefined {
    return StateProvider.context.globalState.get<string>('testify.lastVersion')
  }

  static set lastVersion(version: string) {
    StateProvider.context.globalState.update('testify.lastVersion', version)
  }

  static get lastCommand(): string[] | undefined {
    return StateProvider.context.workspaceState.get<string[]>('testify.lastCommand')
  }

  static set lastCommand(command: string[]) {
    StateProvider.context.workspaceState.update('testify.lastCommand', command)
  }
}
