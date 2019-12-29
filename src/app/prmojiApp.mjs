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

    handlePrEvent(event) {
        const emoji = PrmojiApp.getEmojiForPrEvent(event)
        const messageIds = this.storage.get(event.prUrl)
        for (const messageId of messageIds) {
            this.slackClient.addEmoji(messageId, emoji)
        }
    }

    cleanupOld(days) {
        this.storage.remove(days)
    }

    cleanup() {
        this.storage.remove()
    }

    static getEmojiForPrEvent(prEvent) {
        // TODO implement
        return 'white_check_mark'
    }
}
