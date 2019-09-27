// TODO: This file looks odd. Refactor it as a proper factory

import { exists } from "fs";
import { basename, join } from "path";
import { WorkspaceFolder } from "vscode";
import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";
import { JestTestRunner } from "./JestTestRunner";
import { MochaTestRunner } from "./MochaTestRunner";

const terminalProvider = new TerminalProvider();

function doesFileExist(filePath: string): Promise<boolean> {
  return new Promise(resolve => {
    exists(filePath, doesExist => {
      resolve(doesExist);
    });
  });
}

async function getCustomTestRunnerName(
  rootPath: WorkspaceFolder,
  customTestRunnerPath: string
): Promise<string> {
  const doesExecutableExist = await doesFileExist(
    join(rootPath.uri.fsPath, customTestRunnerPath)
  );

  if (doesExecutableExist) {
    return basename(customTestRunnerPath)
      .replace("_", "")
      .toLowerCase();
  }

  throw new Error("No test runner in specified path. Please verify it.");
}

async function getAvailableTestRunner(
  testRunners: ITestRunnerInterface[],
  rootPath: WorkspaceFolder
): Promise<ITestRunnerInterface> {
  for (const runner of testRunners) {
    const doesRunnerExist = await doesFileExist(
      join(rootPath.uri.fsPath, runner.path)
    );

    if (doesRunnerExist) {
      return runner;
    }
  }

  throw new Error("No test runner in your project. Please install one.");
}

export async function getTestRunner(
  rootPath: WorkspaceFolder
): Promise<ITestRunnerInterface> {
  const configurationProvider = new ConfigurationProvider(rootPath);
  const customTestRunnerPath = configurationProvider.testRunnerPath;

  if (customTestRunnerPath) {
    const customTestRunnerName = await getCustomTestRunnerName(
      rootPath,
      customTestRunnerPath
    );

    if (customTestRunnerName === "jest") {
      return new JestTestRunner(
        configurationProvider,
        terminalProvider,
        customTestRunnerPath
      );
    } else if (customTestRunnerName === "mocha") {
      return new MochaTestRunner(
        configurationProvider,
        terminalProvider,
        customTestRunnerPath
      );
    }
  }

  const jestTestRunner = new JestTestRunner(
    configurationProvider,
    terminalProvider
  );
  const mochaTestRunner = new MochaTestRunner(
    configurationProvider,
    terminalProvider
  );

  return getAvailableTestRunner([jestTestRunner, mochaTestRunner], rootPath);
}
