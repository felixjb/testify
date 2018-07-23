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
  test("Parse ", async () => {
    // Create fake workspace folder
    const tempDir = join(os.tmpdir(), uuid());
    fs.mkdirSync(tempDir);
    try {
      // Create fake package.json
      const packageJson = `
      {
        "devDependencies": {
          "mocha": "5.2.0",
          "jest": "23.4.1"
        }
      }
      `;
      fs.writeFileSync(join(tempDir, "package.json"), packageJson);
      const result = await parseConfig({
        index: 1,
        name: "test",
        uri: Uri.file(tempDir)
      });
      console.log(result);
    } finally {
      fs.unlinkSync(join(tempDir, "package.json"));
      fs.rmdirSync(tempDir);
    }
  });
});
