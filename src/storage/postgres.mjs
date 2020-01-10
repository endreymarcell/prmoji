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

    store(prUrl, messageId) {
        return this.queryPromise(`INSERT INTO pr_messages VALUES (default, default, '${prUrl}', '${messageId}')`)
    }

    get(prUrl) {
        return this.queryPromise(`SELECT message_id FROM pr_messages WHERE pr_url = '${prUrl}'`)
    }

    delete(prUrl) {
        return this.queryPromise(`DELETE FROM message_id WHERE pr_url = '${prUrl}'`)
    }
}
