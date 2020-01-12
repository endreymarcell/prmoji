import {getPrUrlsFromString} from '../utils/helpers.mjs'
import {EmojiMap, Actions} from '../utils/const.mjs'
import * as logger from '../utils/logger.mjs'

export class PrmojiApp {
    constructor(storage, slackClient) {
        this.storage = storage
        this.slackClient = slackClient
    }

    async handleMessage(message) {
        logger.info('Received message:', message)
        if (!message.text) {
            return
        }
        const prUrlsInMessage = getPrUrlsFromString(message.text)
        logger.debug('PR URLs in message:', prUrlsInMessage)
        for (const prUrl of prUrlsInMessage) {
            await this.storage.store(prUrl, message.channel, message.timestamp)
        }
    }

    async handlePrEvent(event) {
        logger.info('Received PR event:', event)

        const emoji = EmojiMap[event.action]
        logger.debug('Selected emoji:', emoji)

        const result = await this.storage.get(event.url)
        logger.debug('Got', result.rows.length, 'matching rows')

        if (result.rows.length > 0) {
            for (const row of result.rows) {
                await this.slackClient.addEmoji(emoji, row.message_channel, row.message_timestamp)
            }

            if (event.action === Actions.MERGED) {
                await this.storage.delete(event.url)
            }
        }
    }

    cleanupOld(days) {
        // this.storage.remove(days)
    }

    cleanup() {
        // this.storage.remove()
    }
}
