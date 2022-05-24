import {commands, ExtensionContext, languages} from 'vscode'
import debugTestCommand from './commands/debug-test-command'
import runTestCommand from './commands/run-test-command'
import FILE_SELECTOR from './constants/file-selector'
import TestRunnerCodeLensProvider from './providers/test-runner-code-lens-provider'

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCodeLensProvider(FILE_SELECTOR, new TestRunnerCodeLensProvider())
  )

  commands.registerCommand('testify.run.test', runTestCommand)
  commands.registerCommand('testify.debug.test', debugTestCommand)
}
