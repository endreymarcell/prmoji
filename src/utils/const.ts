export enum Actions {
  CREATED = "created",
  COMMENTED = "commented",
  APPROVED = "approved",
  CHANGES_REQUESTED = "changes_requested",
  SUBMITTED = "submitted",
  MERGED = "merged",
  CLOSED = "closed",
}

export const EmojiMap = {
  [Actions.COMMENTED]: "speech_balloon",
  [Actions.APPROVED]: "white_check_mark",
  [Actions.CHANGES_REQUESTED]: "no_entry",
  [Actions.MERGED]: "merged",
  [Actions.CLOSED]: "wastebasket",

  [Actions.CREATED]: null,
  [Actions.SUBMITTED]: null,
};

export const IGNORED_COMMENTERS = [
  "sonarcloud",
];

// repositories to watch for notifications
// empty array means watching all repositories
export const WATCHED_REPOSITORIES: string[] = [];
// labels to watch for notifications
// empty array means watching all labels
export const WATCHED_LABELS: string[] = [];
