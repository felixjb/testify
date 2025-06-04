import {commands, ExtensionContext, ExtensionMode, languages, Uri, window} from 'vscode'
import {version} from '../package.json'
import {
  debugTestCallback,
  runTestCallback,
  TestifyCommand,
  watchTestCallback
} from './commands/commands'
import {FILE_SELECTOR} from './constants/file-selector'
import {TestRunnerCodeLensProvider} from './providers/code-lens-provider'

const LAST_VERSION_KEY = 'testify.lastVersion'

export async function activate(context: ExtensionContext): Promise<void> {
  await showUpdateMessage(context)

  context.subscriptions.push(
    languages.registerCodeLensProvider(FILE_SELECTOR, new TestRunnerCodeLensProvider())
  )

  window.onDidCloseTerminal(closedTerminal => closedTerminal.dispose())

  commands.registerCommand(TestifyCommand.run, runTestCallback)
  commands.registerCommand(TestifyCommand.watch, watchTestCallback)
  commands.registerCommand(TestifyCommand.debug, debugTestCallback)
}

async function showUpdateMessage(context: ExtensionContext) {
  const lastVersion = context.globalState.get<string>(LAST_VERSION_KEY)
  const hasProductionVersionChanged =
    lastVersion !== version && context.extensionMode === ExtensionMode.Production
  if (!hasProductionVersionChanged) {
    return
  }

  const Actions = {
    ViewChangelog: 'View Changelog',
    ViewReleaseNotes: 'View Release Notes'
  }
  const openUrl = (url: string) => {
    commands.executeCommand('vscode.open', Uri.parse(url))
  }

  window
    .showInformationMessage(
      `Testify updated to v${version} 🚀 See what's new`,
      Actions.ViewChangelog,
      Actions.ViewReleaseNotes
    )
    .then(selection => {
      if (selection === Actions.ViewChangelog) {
        openUrl('vscode:extension/felixjb.testify')
      }
      if (selection === Actions.ViewReleaseNotes) {
        openUrl(`https://github.com/felixjb/testify/releases/tag/v${version}`)
      }
    })

  await context.globalState.update(LAST_VERSION_KEY, version)
}
