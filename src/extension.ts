import { commands, ExtensionContext, languages, WorkspaceFolder } from "vscode";

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

  commands.registerCommand(
    "testify.run.test",
    (rootPath: WorkspaceFolder, fileName: string, testName: string) =>
      runTestCommand(rootPath, fileName, testName, pluginConfig),
    pluginConfig
  );
  commands.registerCommand(
    "testify.debug.test",
    (rootPath: WorkspaceFolder, fileName: string, testName: string) =>
      debugTestCommand(rootPath, fileName, testName, pluginConfig),
    pluginConfig
  );
}
