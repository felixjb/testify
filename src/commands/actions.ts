export enum CommandActionEnum {
  Run = 'run',
  Watch = 'watch',
  Debug = 'debug',
  RunFile = 'runFile',
  WatchFile = 'watchFile',
  RunNearest = 'runNearest',
  WatchNearest = 'watchNearest',
  DebugNearest = 'debugNearest',
  Rerun = 'rerun'
}

export type TestAction =
  `${CommandActionEnum.Run | CommandActionEnum.Watch | CommandActionEnum.Debug}`

export type FileAction = `${CommandActionEnum.RunFile | CommandActionEnum.WatchFile}`

type CommandAction = `${CommandActionEnum}`

export const TestifyCommands: Record<CommandAction, string> = {
  [CommandActionEnum.Run]: 'testify.run.test',
  [CommandActionEnum.Watch]: 'testify.watch.test',
  [CommandActionEnum.Debug]: 'testify.debug.test',
  [CommandActionEnum.RunFile]: 'testify.run.file',
  [CommandActionEnum.WatchFile]: 'testify.watch.file',
  [CommandActionEnum.RunNearest]: 'testify.run.nearest',
  [CommandActionEnum.WatchNearest]: 'testify.watch.nearest',
  [CommandActionEnum.DebugNearest]: 'testify.debug.nearest',
  [CommandActionEnum.Rerun]: 'testify.run.last'
}
