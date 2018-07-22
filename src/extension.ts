import { commands, ExtensionContext, languages } from "vscode";

import debugTestCommand from "./commands/debugTestCommand";
import runTestCommand from "./commands/runTestCommand";
import FILE_SELECTOR from "./constants/fileSelector";
import TestRunnerCodeLensProvider from "./providers/TestRunnerCodeLensProvider";

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
