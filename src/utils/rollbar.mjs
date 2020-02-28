import Rollbar from 'rollbar'

let rollbar

export function getRollbar() {
    if (rollbar == undefined) {
        rollbar = new Rollbar({
            accessToken: process.env.ROLLBAR_TOKEN,
            captureUncaught: true,
            captureUnhandledRejections: true,
        })
    }
    return rollbar
}
