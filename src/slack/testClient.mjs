export class TestClient {
    constructor(mockAddReactionFn) {
        this.mockAddReactionFn = mockAddReactionFn
    }

    addReaction(name, channel, timestamp) {
        return this.mockAddReactionFn(name, channel, timestamp)
    }
}
