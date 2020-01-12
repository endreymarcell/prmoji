import {PrmojiApp} from '../src/app/prmojiApp'
import {TestStorage} from '../src/storage/testStorage'
import {TestClient} from '../src/slack/testClient'
import * as logger from '../src/utils/logger.mjs'

logger.setLevel(logger.Levels.SILENT)

const MOCK_PR_URL = 'https://github.com/test-user/test-repo/pull/1'
const MOCK_CHANNEL = 'mock-channel'
const MOCK_TIMESTAMP = 'mock-timestamp'

describe('Smoke', () => {
    test('receive slack message', async () => {
        const mockAddReaction = jest.fn(() => Promise.resolve())
        const app = new PrmojiApp(new TestStorage(), new TestClient(mockAddReaction))
        await app.handleMessage({
            text: MOCK_PR_URL,
            channel: MOCK_CHANNEL,
            timestamp: MOCK_TIMESTAMP,
        })
    })

    test('receiving a pr event', async () => {
        const mockAddReaction = jest.fn(() => Promise.resolve())
        const app = new PrmojiApp(new TestStorage(), new TestClient(mockAddReaction))
        await app.handlePrEvent({
            url: MOCK_PR_URL,
            action: 'approved',
        })
    })
})

describe('End-to-end', () => {
    test('Storing a PR, then approving it', async () => {
        const mockAddReaction = jest.fn(() => Promise.resolve())
        const app = new PrmojiApp(new TestStorage(), new TestClient(mockAddReaction))
        await app.handleMessage({
            text: MOCK_PR_URL,
            channel: MOCK_CHANNEL,
            timestamp: MOCK_TIMESTAMP,
        })
        await app.handlePrEvent({
            url: MOCK_PR_URL,
            action: 'approved',
        })
        expect(mockAddReaction).toBeCalledWith('white_check_mark', MOCK_CHANNEL, MOCK_TIMESTAMP)
    })
})
