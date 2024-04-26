export const escapeQuotesAndSpecialCharacters = (text: string): string =>
  text.replace(/[.*+?^"${}()|[\]\\]/g, '\\$&').replace(/[$]/g, '\\$')

export const convertFilePathToWindows = (fileName: string): string => fileName.replace(/\\/g, '/')
