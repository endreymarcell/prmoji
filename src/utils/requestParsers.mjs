import {
    getPrUrl,
    getPrAction,
    getPrCommenter,
    getPrRepoName,
    getPrRepoFullName,
    getPrNumber,
    getPrAuthor,
    getPrLabels,
    getPrTitle,
} from './helpers.mjs'

export function parseGithubRequest(request) {
    console.log(JSON.stringify(request.body, null, 2))
    return {
        url: getPrUrl(request.body),
        action: getPrAction(request),
        commenter: getPrCommenter(request.body),
        name: getPrRepoName(request.body),
        fullName: getPrRepoFullName(request.body),
        number: getPrNumber(request.body),
        author: getPrAuthor(request.body),
        labels: getPrLabels(request.body),
        title: getPrTitle(request.body),
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
