import { commands, ExtensionContext, languages } from "vscode";
import debugTestCommand from "./commands/debugTestCommand";
import runTestCommand from "./commands/runTestCommand";
import watchTestCommand from "./commands/watchTestCommand";
import FILE_SELECTOR from "./constants/fileSelector";
import TestRunnerCodeLensProvider from "./providers/TestRunnerCodeLensProvider";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCodeLensProvider(
      FILE_SELECTOR,
      new TestRunnerCodeLensProvider()
    )
  );

  commands.registerCommand("testify.run.test", runTestCommand);
  commands.registerCommand("testify.run.watch", watchTestCommand);
  commands.registerCommand("testify.debug.test", debugTestCommand);
}
