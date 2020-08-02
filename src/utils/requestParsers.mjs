import {getPrUrl, getPrAction, getPrCommenter} from './helpers.mjs'

export function parseGithubRequest(request) {
    return {
        url: getPrUrl(request.body),
        action: getPrAction(request),
        commenter: getPrCommenter(request.body),
        name: request.body.repository.name,
        fullName: request.body.repository.full_name,
        number: request.body.pull_request.number,
        author: request.body.user.login,
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
