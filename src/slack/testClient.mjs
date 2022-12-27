export class TestClient {
  constructor(mockAddReactionFn = null, mockSendMessageFn = null) {
    this.mockAddReactionFn = mockAddReactionFn || (() => {});
    this.mockSendMessageFn = mockSendMessageFn || (() => {});
  }

  addEmoji(name, channel, timestamp) {
    return this.mockAddReactionFn(name, channel, timestamp);
  }

  sendMessage(message, channel) {
    return this.mockSendMessageFn(message, channel);
  }
}
