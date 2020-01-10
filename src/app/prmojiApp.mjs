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
        for (const prUrl of prUrlsInMessage) {
            this.storage.store(prUrl, message.channel, message.ts)
        }
    }

    handlePrEvent(event) {
        console.log('Received PR event:', event)
        const emoji = EMOJI[event.action]
        this.storage.get(event.url).then((entries) => {
            console.log('result is', result)
            if (entries) {
                for (const entry of entries) {
                    // this.slackClient.addEmoji(emoji, messageId)
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
