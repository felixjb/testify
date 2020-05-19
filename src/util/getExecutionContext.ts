import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import TestRunnerCodeLensProvider from "../providers/TestRunnerCodeLensProvider";

export function getExecutionContext(workspace) {
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

export function createCodeLensSubscription(languages, fileSelector) {
  if (!fileSelector) {
    return;
  }

  return languages.registerCodeLensProvider(
    fileSelector,
    new TestRunnerCodeLensProvider()
  );
}
