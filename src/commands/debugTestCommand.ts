import { getTestRunner } from "../runners/TestRunnerFactory";

async function debugTest(rootPath, fileName, testName) {
  const testRunner = await getTestRunner(rootPath);

  testRunner.debugTest(testName, fileName);
}

export default debugTest;
