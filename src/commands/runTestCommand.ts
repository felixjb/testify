import { getTestRunner } from "../runners/TestRunnerFactory";

async function runTest(rootPath, fileName, testName) {
  const testRunner = await getTestRunner(rootPath);

  testRunner.runTest(testName, fileName);
}

export default runTest;
