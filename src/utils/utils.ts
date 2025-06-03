import which from 'which'

export const escapeQuotesAndSpecialCharacters = (text: string): string =>
  text.replace(/[.*+?^"${}()|[\]\\]/g, '\\$&').replace(/[$]/g, '\\$')

export const convertFilePathToWindows = (fileName: string): string => fileName.replace(/\\/g, '/')

export const getNodePath = (): string | null => which.sync('node', {nothrow: true})
