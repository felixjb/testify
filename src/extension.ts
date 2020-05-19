import { commands, ExtensionContext, languages, workspace } from "vscode";
import debugTestCommand from "./commands/debugTestCommand";
import runTestCommand from "./commands/runTestCommand";
import TestRunnerCodeLensProvider from "./providers/TestRunnerCodeLensProvider";

export function activate(context: ExtensionContext) {
  const reregisterTestifyLens = registerTestingLens(context);
  // whenever the user configuration is changed, reregister the extension
  workspace.onDidChangeConfiguration(reregisterTestifyLens);

  commands.registerCommand("testify.run.test", runTestCommand);
  commands.registerCommand("testify.debug.test", debugTestCommand);
}

function registerTestingLens(context: ExtensionContext) {
  // automatically register testify codelens
  // return a function that when run will dispose of and re-register the codelens.
  const lensProvider = new TestRunnerCodeLensProvider();
  const subscription = register(getFileSelector());

  function register(fileSelector) {
    // create a new subscription to our beautiful lenses
    // push them on to the current context.subscriptions array
    const newSubscription = languages.registerCodeLensProvider(
      fileSelector,
      lensProvider
    );

    context.subscriptions.push(newSubscription);
    return newSubscription;
  }

  function getFileSelector() {
    // this allows a fast and easy way to get the extension's configurations.
    // doesn't care about open workspace/folder
    const { testFilePattern } = workspace.getConfiguration("testify");

    return {
      pattern: testFilePattern,
      scheme: "file"
    };
  }

  return function reregister() {
    // out with the old, in with the new
    const updatedFileSelector = getFileSelector();
    subscription.dispose();
    register(updatedFileSelector);
  };
}
