import {PrmojiApp} from '../src/app/prmojiApp'
import {TestStorage} from '../src/storage/testStorage'
import {TestClient} from '../src/slack/testClient'
import * as logger from '../src/utils/logger.mjs'
import {IGNORED_COMMENTERS} from '../src/utils/const.mjs'

logger.setLevel(logger.Levels.SILENT)

const MOCK_PR_URL = 'https://github.com/test-user/test-repo/pull/1'
const MOCK_CHANNEL = 'mock-channel'
const MOCK_TIMESTAMP = 'mock-timestamp'

const MOCK_STORAGE_CONTENTS = [
    {
        pr_url: MOCK_PR_URL,
        message_channel: MOCK_CHANNEL,
        message_timestamp: MOCK_TIMESTAMP,
    },
]

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

    test('Comments from Jenkins are ignored', async () => {
        const mockAddReaction = jest.fn(() => Promise.resolve())
        const app = new PrmojiApp(new TestStorage(), new TestClient(mockAddReaction))
        await app.handleMessage({
            text: MOCK_PR_URL,
            channel: MOCK_CHANNEL,
            timestamp: MOCK_TIMESTAMP,
        })
        await app.handlePrEvent({
            url: MOCK_PR_URL,
            action: 'commented',
            commenter: IGNORED_COMMENTERS[0],
        })
        expect(mockAddReaction).not.toBeCalled()
    })

    describe('Actions affecting the storage', () => {
        test('Commenting has no effect', async () => {
            const mockAddReaction = jest.fn(() => Promise.resolve())
            const app = new PrmojiApp(new TestStorage(MOCK_STORAGE_CONTENTS), new TestClient(mockAddReaction))
            await app.handlePrEvent({
                url: MOCK_PR_URL,
                action: 'commented',
            })
            expect((await app.storage.get(MOCK_PR_URL)).rows.length).toBe(1)
        })

        test('Requesting changes has no effect', async () => {
            const mockAddReaction = jest.fn(() => Promise.resolve())
            const app = new PrmojiApp(new TestStorage(MOCK_STORAGE_CONTENTS), new TestClient(mockAddReaction))
            await app.handlePrEvent({
                url: MOCK_PR_URL,
                action: 'changes_requested',
            })
            expect((await app.storage.get(MOCK_PR_URL)).rows.length).toBe(1)
        })

        test('Approving has no effect', async () => {
            const mockAddReaction = jest.fn(() => Promise.resolve())
            const app = new PrmojiApp(new TestStorage(MOCK_STORAGE_CONTENTS), new TestClient(mockAddReaction))
            await app.handlePrEvent({
                url: MOCK_PR_URL,
                action: 'approved',
            })
            expect((await app.storage.get(MOCK_PR_URL)).rows.length).toBe(1)
        })

        test('Merging removes entry from the storage', async () => {
            const mockAddReaction = jest.fn(() => Promise.resolve())
            const app = new PrmojiApp(new TestStorage(MOCK_STORAGE_CONTENTS), new TestClient(mockAddReaction))
            await app.handlePrEvent({
                url: MOCK_PR_URL,
                action: 'merged',
            })
            expect((await app.storage.get(MOCK_PR_URL)).rows.length).toBe(0)
        })

        test('Closing without merging removes entry from the storage', async () => {
            const mockAddReaction = jest.fn(() => Promise.resolve())
            const app = new PrmojiApp(new TestStorage(MOCK_STORAGE_CONTENTS), new TestClient(mockAddReaction))
            await app.handlePrEvent({
                url: MOCK_PR_URL,
                action: 'closed',
            })
            expect((await app.storage.get(MOCK_PR_URL)).rows.length).toBe(0)
        })
    })
})
