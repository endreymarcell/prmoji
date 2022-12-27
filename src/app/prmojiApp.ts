import * as logger from "../utils/logger.ts";
import GithubEvent from "../types/GithubEvent.ts";
import SlackMessage from "../types/SlackMessage.ts";
import { Actions, EmojiMap } from "../utils/const.ts";
import { SlackClient } from "../slack/client.ts";
import { PostgresStorage } from "../storage/postgres.ts";
import {
  getMessage,
  getPrUrlsFromString,
  shouldAddEmoji,
  shouldNotify,
} from "../utils/helpers.ts";

export class PrmojiApp {
  storage: PostgresStorage;
  slackClient: SlackClient;
  notificationsChannelId: string | null;

  constructor(
    storage: PostgresStorage,
    slackClient: SlackClient,
    notificationsChannelId: string | null = null,
  ) {
    logger.debug("[app] Initializing PrmojiApp instance");
    this.storage = storage;
    this.slackClient = slackClient;
    this.notificationsChannelId = notificationsChannelId;
  }

  async handleMessage(message: SlackMessage) {
    logger.info(
      "[app] Received Slack message",
      message.text ? message.text.substr(0, 8) : "(no message text)",
    );
    if (!message.text || !message.channel || !message.timestamp) {
      logger.debug("[app] Missing field(s), discarding message.");
      return;
    }

    const prUrlsInMessage = getPrUrlsFromString(message.text);
    logger.debug(
      "[app] PR URLs in message:",
      prUrlsInMessage.length > 0 ? prUrlsInMessage : "none",
    );

    for (const prUrl of prUrlsInMessage) {
      logger.debug("[app] Storing", prUrl);
      await this.storage.store(prUrl, message.channel, message.timestamp);
    }
  }

  async handlePrEvent(event: GithubEvent) {
    logger.info("[app] Received PR event:", event.number || "(no PR number)");
    if (!event.url || !event.action) {
      logger.debug("[app] Missing field(s), discarding PR event.");
      return;
    }

    if (this.notificationsChannelId && shouldNotify(event)) {
      logger.info("[app] Event meets notification criteria, sending message.");
      await this.slackClient.sendMessage(
        getMessage(event),
        this.notificationsChannelId,
      );
    } else {
      logger.info(
        "[app] Event does not meet notification criteria, not sending message",
      );
    }

    logger.debug("[app] Looking up PR in the storage");
    const result = await this.storage.get(event.url);

    if (!result) {
      logger.debug("[app] No matching item found, discarding event.");
      return;
    }

    logger.debug(
      "[app] Got",
      result.length,
      "matching item" + (result.length === 1 ? "" : "s"),
    );

    if (result.length > 0) {
      const emoji = EmojiMap[event.action];
      logger.debug("[app] Selected emoji:", emoji);

      if (!emoji) {
        logger.debug("[app] No emoji for this event, discarding.");
        return;
      }

      if (shouldAddEmoji(event)) {
        for (const item of result) {
          logger.info("[app] Adding emoji", emoji);
          await this.slackClient.addEmoji(
            emoji,
            item.messageChannel,
            item.messageTimestamp,
          );
        }
      } else {
        logger.info("[app] Should not add emoji for this event.");
      }

      if (event.action === Actions.MERGED || event.action === Actions.CLOSED) {
        logger.debug("[app] Deleting", event.url);
        await this.storage.deleteByPrUrl(event.url);
      }
    }
  }

  cleanupOld(days = 7) {
    logger.info("[app] Cleaning up entries as old as", days, "days or older");
    return this.storage.deleteBeforeDays(days);
  }

  cleanup() {
    logger.info("[app] Cleaning up all entries");
    this.storage.deleteAll();
  }
}
