import Postgres from 'pg'
import * as logger from '../utils/logger.mjs'

export class PostgresStorage {
    constructor(connectionString) {
        this.client = new Postgres.Client({connectionString, ssl: true})
        this.client.connect()
    }

    execute(query) {
        logger.silly(query)
        return this.client.query(query).catch((error) => logger.error(error))
    }
    store(prUrl, messageChannel, messageTimestamp) {
        logger.debug('Storage: storing', {prUrl, messageChannel, messageTimestamp})
        return this.execute(
            `INSERT INTO pr_messages VALUES (default, default, '${prUrl}', '${messageChannel}', '${messageTimestamp}')`,
        )
    }

    get(prUrl) {
        logger.debug('Storage: getting', prUrl)
        return this.execute(`SELECT message_channel, message_timestamp FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }

    delete(prUrl) {
        logger.debug('Storage: deleting', prUrl)
        return this.execute(`DELETE FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }

    deleteAll() {
        logger.debug('Storage: deleting all entries')
        return this.execute('DELETE FROM pr_messages')
    }
}
