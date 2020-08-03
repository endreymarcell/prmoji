import express from 'express'

import {PrmojiApp} from './app/prmojiApp.mjs'
import {PostgresStorage} from './storage/postgres.mjs'
import {SlackClient} from './slack/client.mjs'
import {parseGithubRequest, parseSlackRequest} from './utils/requestParsers.mjs'
import {getLogLevelFromArgs} from './utils/helpers.mjs'
import * as logger from './utils/logger.mjs'

const PORT = process.env.PORT || 5000
const {AIR_NOTIFICATIONS_CHANNEL_ID} = process.env

const logLevel = getLogLevelFromArgs(process.argv)
logger.setLevel(logLevel)
logger.info('Logging level set to', logLevel)

const storage = new PostgresStorage(process.env.DATABASE_URL)
const slackClient = new SlackClient(process.env.SLACK_TOKEN)
const app = new PrmojiApp(storage, slackClient, AIR_NOTIFICATIONS_CHANNEL_ID)

express()
    .use(express.json())
    .get('/', healthcheck)
    .post('/event/github', handleGithubEvent)
    .post('/event/slack', handleSlackEvent)
    .post('/cleanup/', handleCleanupRequest)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

function healthcheck(req, res) {
    res.send('OK')
}

function handleGithubEvent(request, response) {
    logger.info('github_event_received')
    response.send('OK')
    app.handlePrEvent(parseGithubRequest(request))
}

function handleSlackEvent(request, response) {
    logger.info('slack_event_received')
    if (request.body.challenge) {
        response.send(request.body.challenge)
    } else {
        response.send('OK')
        app.handleMessage(parseSlackRequest(request))
    }
}

function handleCleanupRequest(request, response) {
    logger.info('cleanup_request_received')
    app.cleanupOld()
        .then(() => response.send('OK'))
        .catch(() => {
            response.statusCode = 500
            response.send()
        })
}
