import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import { join } from "path";
import { Uri } from "vscode";

import { parseConfig } from "../../parser/configParser";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    // tslint:disable-next-line:no-bitwise one-variable-per-declaration
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// tslint:disable:no-console
suite("testFrameworkParser Tests", () => {
  // Defines a Mocha unit test
  test("Parse mocha", async () => {
    // Create fake workspace folder
    const tempDir = join(os.tmpdir(), uuid());
    fs.mkdirSync(tempDir);
    try {
      // Create fake package.json
      const packageJson = `
      {
        "devDependencies": {
          "mocha": "5.2.0"
        }
      }
      `;
      fs.writeFileSync(join(tempDir, "package.json"), packageJson);
      const result = await parseConfig({
        index: 1,
        name: "test",
        uri: Uri.file(tempDir)
      });
      assert.equal(result.frameworkConfigs.length, 1);
      assert.equal(result.frameworkConfigs[0].framework, "mocha");
      assert.equal(result.frameworkConfigs[0].ignorePatterns.length, 0);
      assert.equal(result.frameworkConfigs[0].patterns.length, 1);
    } finally {
      fs.unlinkSync(join(tempDir, "package.json"));
      fs.rmdirSync(tempDir);
    }
  });

  test("Parse jest config from package.json with testRegex", async () => {
    // Create fake workspace folder
    const tempDir = join(os.tmpdir(), uuid());
    fs.mkdirSync(tempDir);
    try {
      // Create fake package.json
      const packageJson = `
      {
        "devDependencies": {
          "jest": "23.4.1"
        },
        "jest":{
          "setupFiles": [
            "<rootDir>/test-shim.js",
            "<rootDir>/test-setup.js"
          ],
          "moduleFileExtensions": [
            "ts",
            "tsx",
            "js",
            "jsx",
            "json",
            "node"
          ],
          "testRegex": "TESTREGEX",
          "testPathIgnorePatterns": [
            "/dist/",
            "/node_modules/"
          ],
          "collectCoverage": true
        }
      }
      `;
      fs.writeFileSync(join(tempDir, "package.json"), packageJson);
      const result = await parseConfig({
        index: 1,
        name: "test",
        uri: Uri.file(tempDir)
      });
      assert.equal(result.frameworkConfigs.length, 1);
      assert.equal(result.frameworkConfigs[0].framework, "jest");
      assert.equal(result.frameworkConfigs[0].ignorePatterns.length, 2);
      assert.equal(result.frameworkConfigs[0].ignorePatterns[0], "/dist/");
      assert.equal(
        result.frameworkConfigs[0].ignorePatterns[1],
        "/node_modules/"
      );
      assert.equal(result.frameworkConfigs[0].patterns.length, 1);
      assert.equal(result.frameworkConfigs[0].patterns[0], "/TESTREGEX/");
    } finally {
      fs.unlinkSync(join(tempDir, "package.json"));
      fs.rmdirSync(tempDir);
    }
  });

  test("Parse jest config from package.json with testMatch", async () => {
    // Create fake workspace folder
    const tempDir = join(os.tmpdir(), uuid());
    fs.mkdirSync(tempDir);
    try {
      // Create fake package.json
      const packageJson = `
      {
        "devDependencies": {
          "jest": "23.4.1"
        },
        "jest":{
          "setupFiles": [
            "<rootDir>/test-shim.js",
            "<rootDir>/test-setup.js"
          ],
          "moduleFileExtensions": [
            "ts",
            "tsx",
            "js",
            "jsx",
            "json",
            "node"
          ],
          "testMatch": [
            "**/match1/*",
            "**/match2/*"
          ],
          "testPathIgnorePatterns": [
            "/dist/",
            "/node_modules/"
          ],
          "collectCoverage": true
        }
      }
      `;
      fs.writeFileSync(join(tempDir, "package.json"), packageJson);
      const result = await parseConfig({
        index: 1,
        name: "test",
        uri: Uri.file(tempDir)
      });
      assert.equal(result.frameworkConfigs.length, 1);
      assert.equal(result.frameworkConfigs[0].framework, "jest");
      assert.equal(result.frameworkConfigs[0].ignorePatterns.length, 2);
      assert.equal(result.frameworkConfigs[0].ignorePatterns[0], "/dist/");
      assert.equal(
        result.frameworkConfigs[0].ignorePatterns[1],
        "/node_modules/"
      );
      assert.equal(result.frameworkConfigs[0].patterns.length, 2);
      assert.equal(result.frameworkConfigs[0].patterns[0], "**/match1/*");
      assert.equal(result.frameworkConfigs[0].patterns[1], "**/match2/*");
    } finally {
      fs.unlinkSync(join(tempDir, "package.json"));
      fs.rmdirSync(tempDir);
    }
  });
});
