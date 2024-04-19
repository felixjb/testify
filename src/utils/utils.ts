export const escapeCharacter = (text: string, character: string): string =>
  text.replace(new RegExp(character, 'g'), `\\${character}`)

export const escapeQuotes = (text: string): string => escapeCharacter(text, '"')

export const convertFilePathToWindows = (fileName: string): string => fileName.replace(/\\/g, '/')
