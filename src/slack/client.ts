import { WebClient } from "https://deno.land/x/slack_web_api@6.7.2/mod.js";
import * as logger from "../utils/logger.ts";

export class SlackClient {
  // deno-lint-ignore no-explicit-any
  client: any;

  constructor(token: string) {
    this.client = new WebClient(token);
  }

  async addEmoji(name: string, channel: string, timestamp: string) {
    logger.info(
      "[slack] Slack client called with",
      JSON.stringify({ emoji: name, channel, timestamp }),
    );

    try {
      await this.client.reactions.add({ name, channel, timestamp });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  sendMessage(message: string, channel: string) {
    logger.info(
      "[slack] Slack client called with:",
      JSON.stringify({ channel, message: "(hidden)" }),
    );
    return this.client.chat.postMessage({ channel, text: message });
  }
}
