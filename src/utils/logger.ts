let _level: Levels | undefined;

type MessagePart =
  | string
  | number
  | boolean
  | undefined
  | null
  | Record<string, unknown>
  | RegExpMatchArray
  | [];

export enum Levels {
  SILENT = "silent",
  ERROR = "error",
  INFO = "info",
  DEBUG = "debug",
  SILLY = "silly",
}

export function setLevel(level: Levels): void {
  _level = level;
}

function consoleLog(level: Levels, message: string): void {
  if (level === Levels.ERROR) {
    console.error(message);
  } else {
    console.log(message);
  }
}

export function log(level: Levels, ...messageParts: MessagePart[]): void {
  const message = messageParts.join(" ");
  if (_level && level <= _level) {
    consoleLog(level, message);
  }
}

function createLoggerFn(
  level: Levels,
): (...messageParts: MessagePart[]) => void {
  return (...messageParts) =>
    log(level, `(${level})`, ...(messageParts.map((p) => JSON.stringify(p))));
}

export const error = createLoggerFn(Levels.ERROR);
export const info = createLoggerFn(Levels.INFO);
export const debug = createLoggerFn(Levels.DEBUG);
export const silly = createLoggerFn(Levels.SILLY);
