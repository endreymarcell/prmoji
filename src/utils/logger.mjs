import {getRollbar} from './rollbar.mjs'

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
    const message = messageParts.join(' ')
    if (_level && level <= _level) {
        consoleLog(level, message)
    }
    if (_level !== Levels.SILENT && level <= Levels.INFO) {
        rollbarLog(level, message)
    }
}

function consoleLog(level, message) {
    if (level === Levels.ERROR) {
        console.error(message)
    } else {
        console.log(message)
    }
}

function rollbarLog(level, message) {
    if (level === Levels.ERROR) {
        getRollbar().warning(message)
    } else {
        getRollbar().info(message)
    }
}

export const error = (...messageParts) => log(Levels.ERROR, ...messageParts)
export const info = (...messageParts) => log(Levels.INFO, ...messageParts)
export const debug = (...messageParts) => log(Levels.DEBUG, ...messageParts)
export const silly = (...messageParts) => log(Levels.SILLY, ...messageParts)
