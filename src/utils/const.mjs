export const Actions = {
    COMMENTED: 'commented',
    APPROVED: 'approved',
    CHANGES_REQUESTED: 'changes_requested',
    MERGED: 'merged',
}

export const EmojiMap = {
    [Actions.COMMENTED]: 'speech_balloon',
    [Actions.APPROVED]: 'white_check_mark',
    [Actions.CHANGES_REQUESTED]: 'no_entry',
    [Actions.MERGED]: 'merged',
}
