import Client from 'pg-native'
import * as logger from '../utils/logger.mjs'
import {getDateStringForDeletion} from '../utils/helpers.mjs'

export class PostgresStorage {
    constructor(connectionString) {
        this.client = new Client()
        this.client.connect(connectionString, (error) => {
            if (error) {
                logger.error('[storage] Error while connecting to the database:', error)
            } else {
                logger.info('[storage] Successfully connected to the database')
            }
        })
    }

    execute(query) {
        logger.debug('[storage] executing query:', query)
        return new Promise((resolve, reject) => {
            return this.client.query(query, (error, rows) => {
                if (error) {
                    logger.error('[storage]', error)
                    reject()
                } else {
                    const result = JSON.stringify(rows)
                    logger.debug('[storage] DB returned:', result.length > 0 ? result : 'none')
                    resolve(rows)
                }
            })
        })
    }
    store(prUrl, messageChannel, messageTimestamp) {
        logger.debug('[storage] storing', JSON.stringify({prUrl, messageChannel, messageTimestamp}))
        return this.execute(
            `INSERT INTO pr_messages VALUES (default, default, '${prUrl}', '${messageChannel}', '${messageTimestamp}')`,
        )
    }

    async get(prUrl) {
        logger.debug('[storage] getting', prUrl)
        const result = await this.execute(
            `SELECT message_channel, message_timestamp FROM pr_messages WHERE pr_url = '${prUrl}'`,
        )
        logger.debug('[storage] so far so good')
        return result
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
