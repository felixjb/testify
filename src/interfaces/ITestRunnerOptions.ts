import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export interface ITestRunnerOptions {
  terminalProvider: TerminalProvider;
  configurationProvider: ConfigurationProvider;
}
