import { commands, ExtensionContext, languages } from "vscode";

import debugTestCommand from "./commands/debugTestCommand";
import runTestCommand from "./commands/runTestCommand";
import { PluginConfig } from "./config/PluginConfig";
import FILE_SELECTOR from "./constants/fileSelector";
import TestRunnerCodeLensProvider from "./providers/TestRunnerCodeLensProvider";

export function activate(context: ExtensionContext) {
  const pluginConfig = new PluginConfig();

  context.subscriptions.push(
    languages.registerCodeLensProvider(
      FILE_SELECTOR,
      new TestRunnerCodeLensProvider(pluginConfig)
    )
  );

  commands.registerCommand("testify.run.test", runTestCommand);
  commands.registerCommand("testify.debug.test", debugTestCommand);
}
