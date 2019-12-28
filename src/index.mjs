import express from 'express'

import {PrmojiApp} from './app/prmojiApp'
import {PostgresStorage} from './storage/postgres'
import {SlackClient} from './slack/client'
import {parseGithubRequest, parseSlackRequest} from './utils/requestParsers'

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
    console.log(new Date(), 'github_event_received')
    response.send('OK')
    app.handlePrEvent(parseGithubRequest(request))
}

function handleSlackEvent(request, response) {
    console.log(new Date(), 'slack_event_received')
    response.send('OK')
    app.handleMessage(parseSlackRequest(request))
}
