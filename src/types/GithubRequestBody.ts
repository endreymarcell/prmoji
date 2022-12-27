import { Actions } from "../utils/const.ts";

export default interface GithubRequestBody {
  action: Actions;
  issue?: {
    number: number;
    title?: string;
    pull_request: {
      html_url: string;
    };
    user: {
      login: string;
    };
  };
  pull_request?: {
    number: number;
    html_url: string;
    title?: string;
    merged: boolean;
    user: {
      login: string;
    };
    labels: {
      name: string;
    }[];
  };
  comment: {
    body: string;
    user: {
      login: string;
    };
  };
  review?: {
    state: string;
  };
  repository?: {
    name: string;
    full_name: string;
  };
  event?: {
    client_msg_id: string;
    text: string;
    channel: string;
    event_ts: string;
  };
}
