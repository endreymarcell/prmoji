import {getPrUrlsFromString, shouldAddEmoji} from '../utils/helpers.mjs'
import {EmojiMap, Actions} from '../utils/const.mjs'
import * as logger from '../utils/logger.mjs'
import {shouldNotify, getMessage} from '../utils/helpers.mjs'

export class PrmojiApp {
    constructor(storage, slackClient, airNotificationsChannelId = null) {
        logger.debug('[app] Initializing PrmojiApp instance')
        this.storage = storage
        this.slackClient = slackClient
        this.airNotificationsChannelId = airNotificationsChannelId
    }

    async handleMessage(message) {
        logger.info('[app] Received Slack message', message.text ? message.text.substr(0, 8) : '(no message text)')
        if (!message.text || !message.channel || !message.timestamp) {
            logger.debug('Missing field(s), discarding message.')
            return
        }

        const prUrlsInMessage = getPrUrlsFromString(message.text)
        logger.debug('[app] PR URLs in message:', prUrlsInMessage.length > 0 ? prUrlsInMessage : 'none')

        for (const prUrl of prUrlsInMessage) {
            logger.debug('[app] Storing', prUrl)
            await this.storage.store(prUrl, message.channel, message.timestamp)
        }
    }

    async handlePrEvent(event) {
        logger.info('[app] Received PR event:', event.number || '(no PR number)')
        if (!event.url || !event.action) {
            logger.debug('[app] Missing field(s), discarding PR event.')
            return
        }

        if (shouldNotify(event)) {
            logger.info('[app] Event meets notification criteria, sending message.')
            await this.slackClient.sendMessage(getMessage(event), this.airNotificationsChannelId)
        } else {
            logger.info('[app] Event does not meet notification criteria, not sending message')
        }

        logger.debug('[app] Looking up PR in the storage')
        const result = await this.storage.get(event.url)
        logger.debug('[app] Got', result.rows.length, 'matching rows')

        if (result.rows.length > 0) {
            const emoji = EmojiMap[event.action]
            logger.debug('[app] Selected emoji:', emoji)

            for (const row of result.rows) {
                if (shouldAddEmoji(event)) {
                    logger.info('[app] Adding emoji', emoji)
                    await this.slackClient.addEmoji(emoji, row.message_channel, row.message_timestamp)
                } else {
                    logger.info('[app] Should not add emoji for this event.')
                }
            }

            if (event.action === Actions.MERGED || event.action === Actions.CLOSED) {
                logger.debug('Deleting', event.url)
                await this.storage.deleteByPrUrl(event.url)
            }
        }
    }

    cleanupOld(days = 7) {
        logger.info('[app] Cleaning up entries as old as', days, 'days or older')
        return this.storage.deleteBeforeDays(days)
    }

    cleanup() {
        logger.info('[app] Cleaning up all entries')
        this.storage.deleteAll()
    }
}
