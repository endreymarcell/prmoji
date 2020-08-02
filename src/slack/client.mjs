import Slack from '@slack/web-api'
import * as logger from '../utils/logger.mjs'

export class SlackClient {
    constructor(token) {
        this.client = new Slack.WebClient(token)
    }

    addEmoji(name, channel, timestamp) {
        logger.info('Slack client called with', JSON.stringify({emoji: name, channel, timestamp}, null, 2))
        return this.client.reactions.add({name, channel, timestamp}).catch((error) => logger.error(error))
    }

    sendMessage(message, channel) {
        logger.info('Slack client called with:', JSON.stringify({channel, message: '(hidden)'}, null, 2))
        return this.client.chat.postMessage({channel, text: message})
    }
}
