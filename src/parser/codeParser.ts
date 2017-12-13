import { tokenizer } from 'acorn'

const testTokens = ['describe', 'it', 'test']

function codeParser(sourceCode) {
    const parserOptions = {
        locations: true,
    }
    const tokens = [...tokenizer(sourceCode, parserOptions)]

    return tokens.map(({value, loc}, index) => {
        if (testTokens.indexOf(value) === - 1) return

        return {
            loc,
            testName: tokens[index + 2].value
        }
    }).filter(Boolean)
}

export {
    codeParser
}
