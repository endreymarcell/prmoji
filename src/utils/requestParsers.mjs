import {getPrUrl, getPrAction} from './helpers.mjs'

export function parseGithubRequest(request) {
    return {
        url: getPrUrl(request.body),
        action: getPrAction(request),
    }
}

export function parseSlackRequest(request) {
    return {
        id: request.body.event.client_msg_id,
        channel: request.body.event.channel,
        timestamp: request.body.event.ts,
    }
}
