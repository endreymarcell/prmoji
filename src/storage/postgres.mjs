import Postgres from 'pg'
import * as logger from '../utils/logger.mjs'
import {getDateStringForDeletion} from '../utils/helpers.mjs'

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
        logger.debug('[storage] storing', {prUrl, messageChannel, messageTimestamp})
        return this.execute(
            `INSERT INTO pr_messages VALUES (default, default, '${prUrl}', '${messageChannel}', '${messageTimestamp}')`,
        )
    }

    get(prUrl) {
        logger.debug('[storage] getting', prUrl)
        return this.execute(`SELECT message_channel, message_timestamp FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }

    deleteByPrUrl(prUrl) {
        logger.debug('[storage] deleting', prUrl)
        return this.execute(`DELETE FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }

    deleteBeforeDays(numDays) {
        logger.debug('[storage] deleting rows older than', numDays, 'days')
        const now = new Date()
        const dateString = getDateStringForDeletion(now, numDays)
        return this.execute(`DELETE FROM pr_messages WHERE inserted_at < '${dateString}'::date`)
    }

    deleteAll() {
        logger.debug('[storage] deleting all entries')
        return this.execute('DELETE FROM pr_messages')
    }
}
