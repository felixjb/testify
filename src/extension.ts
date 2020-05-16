import { commands, ExtensionContext, languages, workspace } from "vscode";
import { ConfigurationProvider } from "./providers/ConfigurationProvider";
import debugTestCommand from "./commands/debugTestCommand";
import runTestCommand from "./commands/runTestCommand";
import TestRunnerCodeLensProvider from "./providers/TestRunnerCodeLensProvider";

export function activate(context: ExtensionContext) {
  function createCodeLensSubscription(fileSelector) {
    if (!fileSelector) {
      return;
    }

    return languages.registerCodeLensProvider(
      fileSelector,
      new TestRunnerCodeLensProvider()
    );
  }

  let codeLensSubscription = createCodeLensSubscription(getExecutionContext());

  if (!codeLensSubscription) {
    return;
  } // If the current vscode context has no open folder
  context.subscriptions.push(codeLensSubscription);

  commands.registerCommand("testify.run.test", runTestCommand);
  commands.registerCommand("testify.debug.test", debugTestCommand);

  workspace.onDidChangeConfiguration(() => {
    codeLensSubscription.dispose();
    codeLensSubscription = createCodeLensSubscription(getExecutionContext());
    context.subscriptions.push();
  });
}

function getExecutionContext() {
  const x = workspace.workspaceFolders;
  if (!x) {
    return;
  }

  const { configuration } = new ConfigurationProvider(
    workspace.workspaceFolders[0]
  );
  const pattern = configuration.testFilePattern;

  return [
    {
      pattern,
      scheme: "file"
    }
  ];
}