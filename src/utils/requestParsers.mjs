import {getPrUrl, getPrAction, getPrCommenter} from './helpers.mjs'

export function parseGithubRequest(request) {
    return {
        url: getPrUrl(request.body),
        action: getPrAction(request),
        commenter: getPrCommenter(request.body),
    }
}

export function parseSlackRequest(request) {
    return {
        id: request.body.event.client_msg_id,
        text: request.body.event.text,
        channel: request.body.event.channel,
        timestamp: request.body.event.event_ts,
    }
}
