import { commands, ExtensionContext, languages, workspace } from "vscode";
import debugTestCommand from "./commands/debugTestCommand";
import runTestCommand from "./commands/runTestCommand";
import {
  createCodeLensSubscription,
  getExecutionContext
} from "./util/getExecutionContext";

export function activate(context: ExtensionContext) {
  let codeLensSubscription = createCodeLensSubscription(
    languages,
    getExecutionContext(workspace)
  );

  if (!codeLensSubscription) {
    return;
  } // If the current vscode context has no open folder
  context.subscriptions.push(codeLensSubscription);

  workspace.onDidChangeConfiguration(() => {
    codeLensSubscription.dispose();
    codeLensSubscription = createCodeLensSubscription(
      languages,
      getExecutionContext(workspace)
    );
    context.subscriptions.push(codeLensSubscription);
  });

  commands.registerCommand("testify.run.test", runTestCommand);
  commands.registerCommand("testify.debug.test", debugTestCommand);
}
