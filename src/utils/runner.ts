import {exists} from 'fs'

import { TestRunner } from "../types/TestRunner"

async function getTestRunner(rootPath: string): Promise<TestRunner> {
    const doesJestExists = await _doesFileExist(`${rootPath}/node_modules/.bin/jest`)
    if (doesJestExists) {
        return TestRunner.jest
    }

    const doesMochaExists = await _doesFileExist(`${rootPath}/node_modules/.bin/mocha`)
    if (doesMochaExists) {
        return TestRunner.mocha
    }

    throw new Error('No test runner in your project. Please install Jest or Mocha.')
}

function _doesFileExist(filePath): Promise<boolean> {
    return new Promise((resolve) => {
        exists(filePath, (doesFileExist) => {
            resolve(doesFileExist)
        })
    })
}

export {
    getTestRunner
}
