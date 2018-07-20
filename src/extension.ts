import { ExtensionContext, window, languages, commands } from "vscode";

import FILE_SELECTOR from "./constants/fileSelector";
import TestRunnerCodeLensProvider from "./providers/TestRunnerCodeLensProvider";
import runTestCommand from "./commands/runTestCommand";
import debugTestCommand from "./commands/debugTestCommand";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCodeLensProvider(
      FILE_SELECTOR,
      new TestRunnerCodeLensProvider()
    )
  );

  commands.registerCommand("javascript-test-runner.run.test", runTestCommand);
  commands.registerCommand(
    "javascript-test-runner.debug.test",
    debugTestCommand
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
