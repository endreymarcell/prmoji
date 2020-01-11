let _level

export const Levels = {
    SILENT: 0,
    ERROR: 1,
    INFO: 2,
    DEBUG: 3,
    SILLY: 4,
}

export function setLevel(level) {
    _level = level
}

export function log(level, ...messageParts) {
    if (_level && level <= _level) {
        if (level === Levels.ERROR) {
            console.error(...messageParts)
        } else {
            console.info(...messageParts)
        }
    }
}

export const error = (...messageParts) => log(Levels.ERROR, ...messageParts)
export const info = (...messageParts) => log(Levels.INFO, ...messageParts)
export const debug = (...messageParts) => log(Levels.DEBUG, ...messageParts)
export const silly = (...messageParts) => log(Levels.SILLY, ...messageParts)
