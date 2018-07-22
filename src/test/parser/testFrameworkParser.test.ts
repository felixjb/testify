import { Uri } from "vscode";

import { parseTestFrameworks } from "../../parser/testFrameworkParser";

suite("testFrameworkParser Tests", () => {
  // Defines a Mocha unit test
  test("Parse ", async () => {
    const result = await parseTestFrameworks({
      index: 0,
      name: "test",
      uri: Uri.file(__dirname)
    });
    // tslint:disable-next-line:no-console
    console.log(result);
  });
});
