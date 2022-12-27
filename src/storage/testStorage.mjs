import * as logger from "../utils/logger.mjs";

export class TestStorage {
  constructor(initialContents = []) {
    this.items = initialContents;
  }

  store(prUrl, messageChannel, messageTimestamp) {
    logger.debug("testStorage storing", {
      prUrl,
      messageChannel,
      messageTimestamp,
    });
    this.items.push({
      pr_url: prUrl,
      message_channel: messageChannel,
      message_timestamp: messageTimestamp,
    });

    logger.silly("testStorage contents after storing:", this.items);
    return Promise.resolve();
  }

  get(prUrl) {
    logger.debug("testStorage getting", prUrl);

    logger.silly("testStorage contents at this time", this.items);
    logger.silly("matching items:", {
      rows: this.items.filter((item) => item.pr_url === prUrl),
    });
    return Promise.resolve({
      rows: this.items.filter((item) => item.pr_url === prUrl),
    });
  }

  deleteByPrUrl(prUrl) {
    logger.debug("testStorage deleting", prUrl);
    this.items = this.items.filter((item) => item.pr_url !== prUrl);
    return Promise.resolve();
  }
}
