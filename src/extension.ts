import {commands, ExtensionContext, languages, window} from 'vscode'
import {debugTestCallback} from './commands/debug-test-command'
import {runTestCallback} from './commands/run-test-command'
import {watchTestCallback} from './commands/watch-test-command'
import FILE_SELECTOR from './constants/file-selector'
import {TestRunnerCodeLensProvider} from './providers/code-lens-provider'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    languages.registerCodeLensProvider(FILE_SELECTOR, new TestRunnerCodeLensProvider())
  )

  window.onDidCloseTerminal(closedTerminal => closedTerminal.dispose())

  commands.registerCommand('testify.run.test', runTestCallback)
  commands.registerCommand('testify.debug.test', debugTestCallback)
  commands.registerCommand('testify.watch.test', watchTestCallback)
}
