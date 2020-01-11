export class TestStorage {
    constructor(initialContents = []) {
        this.items = initialContents
    }

    store(prUrl, messageChannel, messageTimestamp) {
        this.items.push({prUrl, messageChannel, messageTimestamp})
        return Promise.resolve()
    }

    get(prUrl) {
        return Promise.resolve({rows: this.items.filter((item) => item.prUrl === prUrl)})
    }

    delete(prUrl) {
        this.items = this.items.filter((item) => item.prUrl !== prUrl)
        return Promise.resolve()
    }
}
