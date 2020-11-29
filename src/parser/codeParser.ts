import { parse, ParserOptions } from "@babel/parser";

const testTokens = ["suite", "describe", "context", "it", "specify", "test"];

function codeParser(sourceCode) {
  const parserOptions: ParserOptions = {
    plugins: [
      "typescript",
      ["decorators", { decoratorsBeforeExport: false }],
      "classPrivateMethods",
      "classPrivateProperties",
      "topLevelAwait",
      "jsx"
    ],
    sourceType: "module",
    tokens: true
  };
  const ast = parse(sourceCode, parserOptions);

  return ast.tokens
    .map(({ value, loc, type }, index) => {
      if (testTokens.indexOf(value) === -1) {
        return;
      }
      if (type.label !== "name") {
        return;
      }
      const nextToken = ast.tokens[index + 1];
      if (!nextToken.type.startsExpr) {
        return;
      }

      return {
        loc,
        testName: ast.tokens[index + 2].value
      };
    })
    .filter(Boolean);
}

export { codeParser };
