export interface IPackage {
  devDependencies?: { [key: string]: string };
  jest?: {
    testMatch?: string[];
    testRegex?: string;
    testPathIgnorePatterns?: string[];
  };
}
