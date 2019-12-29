import express from 'express'

import {PrmojiApp} from './app/prmojiApp.mjs'
import {PostgresStorage} from './storage/postgres.mjs'
import {SlackClient} from './slack/client.mjs'
import {parseGithubRequest, parseSlackRequest} from './utils/requestParsers.mjs'

const PORT = process.env.PORT || 5000

const app = new PrmojiApp(new PostgresStorage(), new SlackClient(process.env.SLACK_TOKEN))

express()
    .use(express.json())
    .get('/', healthcheck)
    .post('/event/github', handleGithubEvent)
    .post('/event/slack', handleSlackEvent)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

function healthcheck(req, res) {
    res.send('OK')
}

function handleGithubEvent(request, response) {
    console.log('github_event_received')
    response.send('OK')
    app.handlePrEvent(parseGithubRequest(request))
}

function handleSlackEvent(request, response) {
    console.log('slack_event_received')
    response.send('OK')
    app.handleMessage(parseSlackRequest(request))
}
