export const Actions = {
    COMMENTED: 'commented',
    APPROVED: 'approved',
    CHANGES_REQUESTED: 'changes_requested',
    MERGED: 'merged',
    CLOSED: 'closed',
}

export const EmojiMap = {
    [Actions.COMMENTED]: 'speech_balloon',
    [Actions.APPROVED]: 'white_check_mark',
    [Actions.CHANGES_REQUESTED]: 'no_entry',
    [Actions.MERGED]: 'merged',
    [Actions.CLOSED]: 'wastebasket',
}

export const IGNORED_COMMENTERS = [
    'prezi-code-change-management',
    'prezi-code-change-bot',
    'jenkinsprezi2',
    'prezipublisher',
    'sonarcloud',
]
