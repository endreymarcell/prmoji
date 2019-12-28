export class PrmojiApp {
    constructor(storage, slackClient) {
        this.storage = storage
        this.slackClient = slackClient
    }

    handleMessage(message) {
        const prUrlsInMessage = getPrUrlsFromString(message.text)
        for (const url of prUrlsInMessage) {
            this.storage.store(url, messageId)
        }
    }

    handlePrEvent(event) {}

    cleanupOld(days) {
        this.storage.remove(days)
    }

    cleanup() {
        this.storage.remove()
    }

    static getEmojiForPrEvent(prEvent) {
        return ''
    }
}
