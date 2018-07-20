import { exists } from "fs";
import { WorkspaceFolder } from "vscode";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";
import { JestTestRunner } from "./JestTestRunner";
import { MochaTestRunner } from "./MochaTestRunner";

const terminalProvider = new TerminalProvider();
const configurationProvider = new ConfigurationProvider();

function doesFileExist(filePath: string): Promise<boolean> {
  return new Promise(resolve => {
    exists(filePath, doesExist => {
      resolve(doesExist);
    });
  });
}

async function getAvailableTestRunner(
  testRunners: ITestRunnerInterface[]
): Promise<ITestRunnerInterface> {
  for (const runner of testRunners) {
    const doesRunnerExist = await doesFileExist(runner.binPath);

    if (doesRunnerExist) {
      return runner;
    }
  }

  throw new Error("No test runner in your project. Please install one.");
}

export async function getTestRunner(
  rootPath: WorkspaceFolder
): Promise<ITestRunnerInterface> {
  const jestTestRunner = new JestTestRunner({
    configurationProvider,
    rootPath,
    terminalProvider
  });
  const mochaTestRunner = new MochaTestRunner({
    configurationProvider,
    rootPath,
    terminalProvider
  });

  return getAvailableTestRunner([jestTestRunner, mochaTestRunner]);
}
