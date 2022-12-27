import { Actions } from "../utils/const.ts";

export default interface GithubEvent {
  url?: string;
  action?: Actions;
  commenter: string;
  comment: string;
  name?: string;
  fullName?: string;
  number?: number;
  author?: string;
  labels: string[];
  title?: string;
}
