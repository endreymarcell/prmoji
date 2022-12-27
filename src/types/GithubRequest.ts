import RequestBody from "./GithubRequestBody.ts";

export default interface GithubRequest {
  headers: {
    "x-github-event"?: string;
  };
  body: RequestBody;
}
