export class PrmojiApp {
    constructor(storage, slackClient) {
        this.storage = storage
        this.slackClient = slackClient
    }

    handleMessage(message) {}

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
