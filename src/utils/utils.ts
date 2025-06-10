import {basename} from 'path'

export const escapeQuotesAndSpecialCharacters = (text: string): string =>
  text.replace(/[.*+?^"${}()|[\]\\]/g, '\\$&').replace(/[$]/g, '\\$')

/**
 * Converts backslashes (`\`) in given path to forward slashes (`/`).
 * This is useful for ensuring compatibility across different operating systems,
 * especially when dealing with file paths in a cross-platform environment.
 * Namely, even though Windows uses backslashes, in most situations, forward slashes are compatible.
 *
 * @param path - The file path to convert
 * @returns The converted file path with forward slashes.
 *
 * @example
 * const filePath = 'C:\\Users\\User\\Documents\\file.txt';
 * const forwardSlashPath = toForwardSlashPath(filePath);
 * console.log(forwardSlashPath);
 * // 'C:/Users/User/Documents/file.txt'
 */
export const toForwardSlashPath = (path: string): string => path.replace(/\\/g, '/')

export const isNodePath = (path: string): boolean =>
  basename(toForwardSlashPath(path), '.exe').toLowerCase() === 'node'
