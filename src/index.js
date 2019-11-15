const express = require('express')

const {handleGithubEvent} = require('./github')
const {handleSlackEvent} = require('./slack')

express()
    .use(express.json())
    .post('/event/github', handleGithubEvent)
    .post('/event/slack', handleSlackEvent)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
