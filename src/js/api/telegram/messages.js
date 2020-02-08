import {MTProto} from "../../mtproto/external"
import PeersManager from "../peers/objects/PeersManager"

type getDialogs_Params_105 = {
    limit: number,
    flags: number,
    exclude_pinned: boolean,
    folder_id: boolean,
    offset_date: number,
    offset_id: number,
    offset_peer: Object,
    hash: string,
}

type getPeerDialogs_Params_105 = {
    peers: Array<Object>
}

type dialogs = {
    dialogs: Array<Object>,
    messages: Array<Object>,
    chats: Array<Object>,
    users: Array<Object>,
}

type dialogsSlice = dialogs | {
    count: number
}

type dialogsNotModified = {
    count: number
}

type Dialogs = dialogs | dialogsSlice | dialogsNotModified


// methods

const getDialogs = (params: getDialogs_Params_105 = {}): Promise<Dialogs> => {
    return MTProto.invokeMethod("messages.getDialogs", {
        flags: params.flags || 0,
        pFlags: {
            exclude_pinned: params.exclude_pinned || false,
            folder_id: params.folder_id || 0,
        },
        offset_date: params.offset_date || 0,
        offset_id: params.offset_id || -1,
        offset_peer: params.offset_peer || {
            _: "inputPeerEmpty",
        },
        limit: params.limit || 20,
        hash: params.hash || ""
    }).then(Dialogs => {
        console.warn("params.folder_id", params.folder_id)
        PeersManager.fillPeersFromUpdate(Dialogs)

        Dialogs.count = Dialogs.count || Dialogs.dialogs.length
        Dialogs.__limit = params.limit || 20

        return Dialogs
    })
}

const getPeerDialogs = (params: getPeerDialogs_Params_105 = {}): Promise<Object> => MTProto.invokeMethod("messages.getPeerDialogs", {
    peers: params.peers
}).then(Dialogs => {
    PeersManager.fillPeersFromUpdate(Dialogs)

    Dialogs.count = Dialogs.count || Dialogs.dialogs.length

    return Dialogs
})

const searchGlobal = (params) => {
    return MTProto.invokeMethod("messages.searchGlobal", {
        q: params.q,
        offset_rate: params.offsetRate || 0,
        offset_peer: params.offsetPeer || {
            _: "inputPeerEmpty",
        },
        offset_id: params.offsetId,
        limit: params.limit
    }).then(Messages => {
        PeersManager.fillPeersFromUpdate(Messages)
        return Messages
    })
}

const messages = {
    getDialogs: getDialogs,
    getPeerDialogs: getPeerDialogs,
    searchGlobal: searchGlobal,
}

export default messages