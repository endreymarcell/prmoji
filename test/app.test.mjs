import {PrmojiApp} from '../src/app/prmojiApp'
import {TestStorage} from '../src/storage/testStorage'
import {TestClient} from '../src/slack/testClient'
import * as logger from '../src/utils/logger.mjs'

logger.setLevel(logger.Levels.SILENT)

describe('prmojiApp', () => {
    test('receive slack message', async () => {
        const mockAddReaction = jest.fn(() => Promise.resolve())
        const app = new PrmojiApp(new TestStorage(), new TestClient(mockAddReaction))
        await app.handleMessage({
            text: 'https://github.com/test-user/test-repo/pull/1',
            channel: 'mock-channel',
            timestamp: 'mock-timestamp',
        })
    })

    test('receiving a pr event', async () => {
        const mockAddReaction = jest.fn(() => Promise.resolve())
        const app = new PrmojiApp(new TestStorage(), new TestClient(mockAddReaction))
        await app.handlePrEvent({
            url: 'https://github.com/test-user/test-repo/pull/1',
            action: 'approved',
        })
    })
})
