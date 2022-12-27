import GithubEvent from "../types/GithubEvent.ts";
import GithubRequest from "../types/GithubRequest.ts";
import GithubRequestBody from "../types/GithubRequestBody.ts";
import { Levels, silly as log } from "./logger.ts";
import {
  Actions,
  IGNORED_COMMENTERS,
  WATCHED_LABELS,
  WATCHED_REPOSITORIES,
} from "./const.ts";

export function getPrUrl(requestBody: GithubRequestBody) {
  if (requestBody.pull_request) {
    return requestBody.pull_request.html_url;
  } else if (
    requestBody.issue && requestBody.issue.pull_request
  ) {
    return requestBody.issue.pull_request.html_url;
  }
}

export function getPrAction(event: GithubRequest) {
  log("getPrAction called with", { headers: event.headers, body: event.body });
  const eventType = event.headers["x-github-event"];

  if (!eventType) {
    return;
  }

  const requestBody = event.body;
  const actionValue = Object.keys(actionConditions).find((key) =>
    actionConditions[key as Actions](eventType, requestBody)
  );

  if (!actionValue) {
    return;
  }

  return actionValue as Actions;
}

export function getPrCommenter(requestBody: GithubRequestBody) {
  return requestBody.comment && requestBody.comment.user &&
    requestBody.comment.user.login;
}

export function getPrCommentBody(requestBody: GithubRequestBody) {
  return requestBody.comment && requestBody.comment.body;
}

export function getPrRepoName(requestBody: GithubRequestBody) {
  return requestBody.repository && requestBody.repository.name;
}

export function getPrRepoFullName(requestBody: GithubRequestBody) {
  return requestBody.repository && requestBody.repository.full_name;
}

export function getPrNumber(requestBody: GithubRequestBody) {
  return (
    (requestBody.pull_request && requestBody.pull_request.number) ||
    (requestBody.issue && requestBody.issue.number)
  );
}

export function getPrAuthor(requestBody: GithubRequestBody) {
  return (
    (requestBody.issue && requestBody.issue.user &&
      requestBody.issue.user.login) ||
    (requestBody.pull_request && requestBody.pull_request.user &&
      requestBody.pull_request.user.login)
  );
}

export function getPrLabels(requestBody: GithubRequestBody) {
  return ((requestBody.pull_request && requestBody.pull_request.labels) || [])
    .map((label) => label.name);
}

export function getPrTitle(requestBody: GithubRequestBody) {
  return (
    (requestBody.issue && requestBody.issue.title) ||
    (requestBody.pull_request && requestBody.pull_request.title)
  );
}
type ActionConditions = {
  [key in Actions]: (
    eventType: string,
    requestBody: GithubRequestBody,
  ) => boolean | undefined;
};
export const actionConditions: ActionConditions = {
  [Actions.COMMENTED]: (eventType: string, requestBody: GithubRequestBody) =>
    (eventType === "issue_comment" && requestBody.action === Actions.CREATED) ||
    (eventType === "pull_request_review" &&
      requestBody.action === Actions.SUBMITTED &&
      requestBody.review?.state === "commented"),
  [Actions.APPROVED]: (eventType: string, requestBody: GithubRequestBody) =>
    eventType === "pull_request_review" &&
    requestBody.action === "submitted" &&
    requestBody.review?.state === "approved",
  [Actions.CHANGES_REQUESTED]: (
    eventType: string,
    requestBody: GithubRequestBody,
  ) =>
    eventType === "pull_request_review" &&
    requestBody.action === "submitted" &&
    requestBody.review?.state === "changes_requested",
  [Actions.MERGED]: (eventType: string, requestBody: GithubRequestBody) =>
    eventType === "pull_request" && requestBody.action === "closed" &&
    requestBody.pull_request?.merged,
  [Actions.CLOSED]: (eventType: string, requestBody: GithubRequestBody) =>
    eventType === "pull_request" && requestBody.action === "closed" &&
    !requestBody.pull_request?.merged,

  [Actions.CREATED]: (_et: string, _rb: GithubRequestBody) => false,
  [Actions.SUBMITTED]: (_et: string, _rb: GithubRequestBody) => false,
};

export function getPrUrlsFromString(text: string) {
  return text.match(/(https:\/\/github\.com\/[\w-_]+\/[\w-_]+\/pull\/\d+)/g) ??
    [];
}

export function getLogLevelFromArgs(argv: string[]) {
  let levelString = "info";
  for (const arg of argv) {
    if (arg.startsWith("--loglevel=")) {
      levelString = arg.substr(11);
      break;
    }
  }
  switch (levelString) {
    case "silent":
      return Levels.SILENT;
    case "error":
      return Levels.ERROR;
    case "debug":
      return Levels.DEBUG;
    case "silly":
      return Levels.SILLY;
    default:
      return Levels.INFO;
  }
}

export function shouldAddEmoji(event: GithubEvent) {
  const isIgnoredComment = event.action === Actions.COMMENTED &&
    IGNORED_COMMENTERS.includes(event.commenter);
  return !isIgnoredComment;
}

export function shouldNotify(event: GithubEvent) {
  log("shouldNotify examining event:", JSON.stringify(event, null, 2));

  const isMerged = event.action === Actions.MERGED;
  const isWatchedRepository = event.fullName &&
    WATCHED_REPOSITORIES.includes(event.fullName);
  const hasWatchedLabel = event.labels.some((label) =>
    WATCHED_LABELS.includes(label)
  );

  const shouldNotify = isMerged && isWatchedRepository && hasWatchedLabel;
  log(
    "Notification criteria:",
    JSON.stringify(
      { isMerged, isWatchedRepository, hasWatchedLabel, shouldNotify },
      null,
      2,
    ),
  );

  return shouldNotify;
}

export function getDateStringForDeletion(date: Date, numDays: number) {
  date.setDate(date.getDate() - numDays);
  return date.toISOString().substr(0, 10);
}

export function getMessage(event: GithubEvent) {
  const repoName = event.name || "(missing repo name)";
  const prUrl = event.url || "(missing PR URL)";
  const prNumber = event.number || "(missing PR number)";
  const prTitleMaxLength = 100;
  const truncatedTitle = event.title && event.title.length > prTitleMaxLength
    ? event.title.substr(0, prTitleMaxLength) + "..."
    : event.title;
  const authorName = event.author || "(missing PR author)";

  return `Merged: <${prUrl}|${repoName} #${prNumber} ${truncatedTitle}> (by ${authorName})`;
}
