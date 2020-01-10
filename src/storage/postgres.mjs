import Postgres from 'pg'

export class PostgresStorage {
    constructor(connectionString) {
        this.client = new Postgres.Client({connectionString, ssl: true})
        this.client.connect()
    }

    queryPromise(query) {
        return new Promise((resolve, reject) => {
            this.client.query(query, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res.rows)
                }
            })
        })
    }

    store(prUrl, messageChannel, messageTimestamp) {
        return this.queryPromise(
            `INSERT INTO pr_messages VALUES (default, default, '${prUrl}', '${messageChannel}', '${messageTimestamp}')`,
        )
    }

    get(prUrl) {
        console.log(`SELECT message_channel, message_timestamp FROM pr_messages WHERE pr_url = '${prUrl}'`)
        return this.queryPromise(`SELECT message_channel, message_timestamp FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }

    delete(prUrl) {
        return this.queryPromise(`DELETE FROM message_channel, message_timestamp WHERE pr_url = '${prUrl}'`)
    }
}
