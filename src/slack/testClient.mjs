export class TestClient {
    constructor(mockAddReactionFn) {
        this.mockAddReactionFn = mockAddReactionFn
    }

    addEmoji(name, channel, timestamp) {
        return this.mockAddReactionFn(name, channel, timestamp)
    }
}
