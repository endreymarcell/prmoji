import express from 'express'

import {handleGithubEvent} from './github.mjs'
import {handleSlackEvent} from './slack.mjs'

const PORT = process.env.PORT || 5000

express()
    .use(express.json())
    .get('/', healthcheck)
    .post('/event/github', handleGithubEvent)
    .post('/event/slack', handleSlackEvent)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

function healthcheck(req, res) {
    res.send('OK')
}
