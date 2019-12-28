export function parseGithubRequest(request) {
    function getPrLink(requestBody) {
        if (requestBody.pull_request != null) {
            return requestBody.pull_request.html_url
        } else if (requestBody.issue != null && requestBody.issue.pull_request != null) {
            return requestBody.issue.pull_request.html_url
        } else {
            return null
        }
    }
}

export function parseSlackRequest(request) {
    return {
        id: request.body.event.client_msd_id,
        text: request.body.event.text,
        timestamp: request.body.event.ts,
    }
}
