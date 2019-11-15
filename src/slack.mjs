export function handleSlackEvent(req, res) {
    console.log('Got Slack event')
    const challenge = req.body.challenge
    res.json({challenge})
}
