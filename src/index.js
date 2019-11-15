const express = require('express')

express()
    .use(express.json())
    .post('/event/github', handleGithubEvent)
    .post('/event/slack', handleSlackEvent)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
