import {EMOJI} from './const'

export function getEmoji(githubEvent) {
    const reaction = Object.keys(reactionConditions).find((key) => reactionConditions[key](eventType, requestBody))
    return EMOJI[reaction]
}

export const reactionConditions = {
    commented: (eventType, requestBody) =>
        (eventType === 'issue_comment' && requestBody.action === 'created') ||
        (eventType === 'pull_request_review' &&
            requestBody.action === 'submitted' &&
            requestBody.review.state === 'commented'),
    approved: (eventType, requestBody) =>
        eventType === 'pull_request_review' &&
        requestBody.action === 'submitted' &&
        requestBody.review.state === 'approved',
    changes_requested: (eventType, requestBody) =>
        eventType === 'pull_request_review' &&
        requestBody.action === 'submitted' &&
        requestBody.review.state === 'changes_requested',
    merged: (eventType, requestBody) =>
        eventType === 'pull_request' && requestBody.action === 'closed' && requestBody.pull_request.merged,
}

export function getPrLinksFromMessage(message) {
    return []
}
