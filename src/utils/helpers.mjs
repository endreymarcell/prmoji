import * as logger from './logger.mjs'
import {Levels} from './logger.mjs'
import {Actions, IGNORED_COMMENTERS} from './const.mjs'

export function getPrUrl(requestBody) {
    if (requestBody.pull_request != null) {
        return requestBody.pull_request.html_url
    } else if (requestBody.issue != null && requestBody.issue.pull_request != null) {
        return requestBody.issue.pull_request.html_url
    } else {
        return null
    }
}

export function getPrAction(githubEvent) {
    logger.silly('getPrAction called with', {headers: githubEvent.headers, body: githubEvent.body})
    const eventType = githubEvent.headers['x-github-event']
    const requestBody = githubEvent.body
    return Object.keys(actionConditions).find((key) => actionConditions[key](eventType, requestBody))
}

export function getPrCommenter(requestBody) {
    return requestBody.comment && requestBody.comment.user && requestBody.comment.user.login
}

export function getPrRepoName(requestBody) {
    return requestBody.repository && requestBody.repository.name
}

export function getPrRepoFullName(requestBody) {
    return requestBody.repository && requestBody.repository.full_name
}

export function getPrNumber(requestBody) {
    return (
        (requestBody.pull_request && requestBody.pull_request.number) || (requestBody.issue && requestBody.issue.number)
    )
}

export function getPrAuthor(requestBody) {
    return (
        (requestBody.issue && requestBody.issue.user && requestBody.issue.user.login) ||
        (requestBody.pull_request && requestBody.pull_request.user && requestBody.pull_request.user.login)
    )
}

export function getPrLabels(requestBody) {
    return (requestBody.labels || []).map((label) => label.name)
}

export function getPrTitle(requestBody) {
    return (
        (requestBody.issue && requestBody.issue.title) || (requestBody.pull_request && requestBody.pull_request.title)
    )
}
export const actionConditions = {
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
    closed: (eventType, requestBody) =>
        eventType === 'pull_request' && requestBody.action === 'closed' && !requestBody.pull_request.merged,
}

export function getPrUrlsFromString(text) {
    return text.match(/(https:\/\/github\.com\/[\w-_]+\/[\w-_]+\/pull\/\d+)/g) || []
}

export function getLogLevelFromArgs(argv) {
    let levelString = 'info'
    for (const arg of argv) {
        if (arg.startsWith('--loglevel=')) {
            levelString = arg.substr(11)
            break
        }
    }
    switch (levelString) {
        case 'silent':
            return Levels.SILENT
        case 'error':
            return Levels.ERROR
        case 'debug':
            return Levels.DEBUG
        case 'silly':
            return Levels.SILLY
        default:
            return Levels.INFO
    }
}

export function shouldAddEmoji(event) {
    const isCommentFromJenkins = event.action === Actions.COMMENTED && IGNORED_COMMENTERS.includes(event.commenter)
    return !isCommentFromJenkins
}

export function shouldNotify(event) {
    logger.debug('shouldNotify examining event:', JSON.stringify(event, null, 2))

    const watchedRepositories = ['prezi/frontend-packages', 'endreymarcell/prmoji-testing']
    const watchedLabels = ['air']

    const isMerged = event.action === Actions.MERGED
    const isWatchedRepository = watchedRepositories.includes(event.fullName)
    const hasWatchedLabel = event.labels.some((label) => watchedLabels.includes(label))

    const shouldNotify = isMerged && isWatchedRepository && hasWatchedLabel
    logger.debug(
        'Notification criteria:',
        JSON.stringify({isMerged, isWatchedRepository, hasWatchedLabel, shouldNotify}, null, 2),
    )

    return shouldNotify
}

export function getDateStringForDeletion(date, numDays) {
    date.setDate(date.getDate() - numDays)
    return date.toISOString().substr(0, 10)
}

export function getMessage(event) {
    const repoName = event.name || '(missing repo name)'
    const prUrl = event.url || '(missing PR URL)'
    const prNumber = event.number || '(missing PR number)'
    const prTitle = event.title || '(missing PR title)'
    const prTitleMaxLength = 50
    const truncatedTitle =
        event.title.length > prTitleMaxLength ? event.title.substr(0, prTitleMaxLength) + '...' : event.title
    const authorName = event.author || '(missing PR author)'

    return `Merged: <${prUrl}|${repoName} #${prNumber} ${truncatedTitle}> (by ${authorName})`
}
