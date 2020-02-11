export type getDialogs_Params_105 = {
    limit: number,
    flags: number,
    exclude_pinned: boolean,
    folder_id: boolean,
    offset_date: number,
    offset_id: number,
    offset_peer: Object,
    hash: string,
}

export type getPeerDialogs_Params_105 = {
    peers: Array<Object>
}

export type dialogs = {
    dialogs: Array<Object>,
    messages: Array<Object>,
    chats: Array<Object>,
    users: Array<Object>,
}

export type dialogsSlice = dialogs | {
    count: number
}

export type dialogsNotModified = {
    count: number
}

export type DialogsType = dialogs | dialogsSlice | dialogsNotModified