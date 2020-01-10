export class SlackClient {
    constructor(token) {
        this.token = token
    }

    addEmoji(emoji, message) {
        console.log('Slack client called with', {emoji, message})
    }
}
