import {PrmojiApp} from '../src/app/prmojiApp'
import {TestStorage} from '../src/storage/testStorage'
import {TestClient} from '../src/slack/testClient'

describe('prmojiApp', () => {
    test('is created', () => {
        const app = new PrmojiApp(new TestStorage(), new TestClient())
        app.cleanup()
    })
})
