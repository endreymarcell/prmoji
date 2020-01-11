import {getPrUrlsFromString} from '../utils/helpers.mjs'
import {EMOJI} from '../utils/const.mjs'

export class PrmojiApp {
    constructor(storage, slackClient) {
        this.storage = storage
        this.slackClient = slackClient
    }

    handleMessage(message) {
        console.log('Received message:', message)
        if (!message.text) {
            return
        }
        const prUrlsInMessage = getPrUrlsFromString(message.text)
        console.log('PR URLs in message:', prUrlsInMessage)
        for (const prUrl of prUrlsInMessage) {
            this.storage.store(prUrl, message.channel, message.timestamp)
        }
    }

    handlePrEvent(event) {
        console.log('Received PR event:', event)
        const emoji = EMOJI[event.action]
        console.log('Selected emoji:', emoji)
        this.storage.get(event.url).then((result) => {
            console.log('Got', result.rows.length, 'matching rows')
            if (result.rows.length > 0) {
                for (const row of result.rows) {
                    this.slackClient.addEmoji(emoji, row.message_channel, row.message_timestamp)
                }
            }
        })
    }

    cleanupOld(days) {
        this.storage.remove(days)
    }

    cleanup() {
        this.storage.remove()
    }
}
