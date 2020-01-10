import Slack from '@slack/web-api'

export class SlackClient {
    constructor(token) {
        this.client = new Slack.WebClient(token)
    }

    addEmoji(name, channel, timestamp) {
        console.log('Slack client called with', {emoji: name, channel, timestamp})
        this.client.reactions.add({name, channel, timestamp})
    }
}
