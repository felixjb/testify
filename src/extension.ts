import {commands, ExtensionContext, languages, window} from 'vscode'
import {
  debugTestCallback,
  runTestCallback,
  TestifyCommand,
  watchTestCallback
} from './commands/commands'
import {FILE_SELECTOR} from './constants/file-selector'
import {TestRunnerCodeLensProvider} from './providers/code-lens-provider'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    languages.registerCodeLensProvider(FILE_SELECTOR, new TestRunnerCodeLensProvider())
  )

  window.onDidCloseTerminal(closedTerminal => closedTerminal.dispose())

  commands.registerCommand(TestifyCommand.run, runTestCallback)
  commands.registerCommand(TestifyCommand.watch, watchTestCallback)
  commands.registerCommand(TestifyCommand.debug, debugTestCallback)
}
