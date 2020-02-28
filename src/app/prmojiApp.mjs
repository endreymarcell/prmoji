import {getPrUrlsFromString, shouldAddEmoji} from '../utils/helpers.mjs'
import {EmojiMap, Actions} from '../utils/const.mjs'
import * as logger from '../utils/logger.mjs'

export class PrmojiApp {
    constructor(storage, slackClient) {
        this.storage = storage
        this.slackClient = slackClient
    }

    async handleMessage(message) {
        logger.info('Received Slack message:', message)
        if (!message.text || !message.channel || !message.timestamp) {
            logger.debug('Missing field(s), discarding message.')
            return
        }

        const prUrlsInMessage = getPrUrlsFromString(message.text)
        logger.debug('PR URLs in message:', prUrlsInMessage)

        for (const prUrl of prUrlsInMessage) {
            logger.debug('Storing', prUrl)
            await this.storage.store(prUrl, message.channel, message.timestamp)
        }
    }

    async handlePrEvent(event) {
        logger.info('Received PR event:', event)
        if (!event.url || !event.action) {
            logger.debug('Missing field(s), discarding PR event.')
            return
        }

        const result = await this.storage.get(event.url)
        logger.debug('Got', result.rows.length, 'matching rows')

        if (result.rows.length > 0) {
            const emoji = EmojiMap[event.action]
            logger.debug('Selected emoji:', emoji)

            for (const row of result.rows) {
                if (shouldAddEmoji(event)) {
                    logger.debug('Adding emoji', emoji)
                    await this.slackClient.addEmoji(emoji, row.message_channel, row.message_timestamp)
                } else {
                    logger.debug('Should not add emoji for this event.')
                }
            }

            if (event.action === Actions.MERGED || event.action === Actions.CLOSED) {
                logger.debug('Deleting', event.url)
                await this.storage.deleteByPrUrl(event.url)
            }
        }
    }

    cleanupOld(days) {
        return this.storage.deleteBeforeDays(7)
    }

    cleanup() {
        this.storage.deleteAll()
    }
}
