export default interface SlackRequest {
  body: {
    event: {
      client_msg_id: string;
      text: string;
      channel: string;
      event_ts: string;
    };
  };
}
