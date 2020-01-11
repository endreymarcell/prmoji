import Postgres from 'pg'

export class PostgresStorage {
    constructor(connectionString) {
        this.client = new Postgres.Client({connectionString, ssl: true})
        this.client.connect()
    }

    store(prUrl, messageChannel, messageTimestamp) {
        console.log('Storage: storing', {prUrl, messageChannel, messageTimestamp})
        return this.client.query(
            `INSERT INTO pr_messages VALUES (default, default, '${prUrl}', '${messageChannel}', '${messageTimestamp}')`,
        )
    }

    get(prUrl) {
        console.log('Storage: getting', prUrl)
        return this.client.query(`SELECT message_channel, message_timestamp FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }

    delete(prUrl) {
        console.log('Storage: deleting', prUrl)
        return this.client.query(`DELETE FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }
}
