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
        for (const url of prUrlsInMessage) {
            this.storage.store(url, message.id)
        }
    }

    handlePrEvent(event) {
        console.log('Received PR event:', event)
        const emoji = EMOJI[event.action]
        this.storage.get(event.url).then((messageIds) => {
            if (messageIds) {
                for (const messageId of messageIds) {
                    this.slackClient.addEmoji(messageId, emoji)
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
