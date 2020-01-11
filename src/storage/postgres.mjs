import Postgres from 'pg'
import * as logger from '../utils/logger.mjs'

export class PostgresStorage {
    constructor(connectionString) {
        this.client = new Postgres.Client({connectionString, ssl: true})
        this.client.connect()
    }

    store(prUrl, messageChannel, messageTimestamp) {
        logger.debug('Storage: storing', {prUrl, messageChannel, messageTimestamp})
        return this.client.query(
            `INSERT INTO pr_messages VALUES (default, default, '${prUrl}', '${messageChannel}', '${messageTimestamp}')`,
        )
    }

    get(prUrl) {
        logger.debug('Storage: getting', prUrl)
        return this.client.query(`SELECT message_channel, message_timestamp FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }

    delete(prUrl) {
        logger.debug('Storage: deleting', prUrl)
        return this.client.query(`DELETE FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }
}
