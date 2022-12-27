import { delay } from "https://deno.land/std@0.170.0/async/delay.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import * as logger from "../utils/logger.ts";
import PrRecord from "../types/PrRecord.ts";
import { getDateStringForDeletion } from "../utils/helpers.ts";

export class PostgresStorage {
  client: Client | undefined;
  connected = false;

  constructor(connectionString: string) {
    this.client = new Client(connectionString);

    void (async () => {
      try {
        await this.client?.connect();
        this.connected = true;
        logger.info("[storage] Successfully connected to the database");
      } catch (error) {
        logger.error(
          "[storage] Error while connecting to the database:",
          error.message,
        );
      }
    })();
  }

  async waitForConnection() {
    while (!(this.client && this.connected)) {
      await delay(1000);
    }
  }

  async execute<T>(query: string): Promise<T[]> {
    logger.debug("[storage] executing query:", query);

    try {
      await this.waitForConnection();

      const response = await this.client?.queryObject({
        camelcase: true,
        text: query,
      });
      const rows = (response?.rows ?? []) as T[];
      const result = JSON.stringify(rows);

      logger.debug(
        "[storage] DB returned:",
        result.length > 0 ? result : "none",
      );

      return rows;
    } catch (error) {
      logger.error("[storage]", error);
      throw error;
    }
  }

  store(prUrl: string, messageChannel: string, messageTimestamp: string) {
    logger.debug(
      "[storage] storing",
      JSON.stringify({ prUrl, messageChannel, messageTimestamp }),
    );
    return this.execute(
      `INSERT INTO pr_messages VALUES (default, default, '${prUrl}', '${messageChannel}', '${messageTimestamp}')`,
    );
  }

  get(prUrl: string) {
    logger.debug("[storage] getting", prUrl);
    return this.execute<PrRecord>(
      `SELECT message_channel, message_timestamp FROM pr_messages WHERE pr_url = '${prUrl}'`,
    );
  }

  deleteByPrUrl(prUrl: string) {
    logger.debug("[storage] deleting", prUrl);
    return this.execute(`DELETE FROM pr_messages WHERE pr_url = '${prUrl}'`);
  }

  deleteBeforeDays(numDays: number) {
    logger.debug("[storage] deleting rows older than", numDays, "days");
    const now = new Date();
    const dateString = getDateStringForDeletion(now, numDays);
    return this.execute(
      `DELETE FROM pr_messages WHERE inserted_at < '${dateString}'::date`,
    );
  }

  deleteAll() {
    logger.debug("[storage] deleting all entries");
    return this.execute("DELETE FROM pr_messages");
  }
}
