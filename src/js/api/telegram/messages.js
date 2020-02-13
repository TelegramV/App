import {MTProto} from "../../mtproto/external"
import PeersManager from "../peers/objects/PeersManager"
import type {DialogsType, getDialogs_Params_105, getPeerDialogs_Params_105} from "./types"

// methods

const getDialogs = (params: getDialogs_Params_105 = {}): Promise<DialogsType> => {
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

const getChats = id => {
    return MTProto.invokeMethod("messages.getChats", {
        id
    }).then(Chats => {
        console.log(Chats)
        return PeersManager.fillPeersFromUpdate(Chats).chats
    })
}

const messages = {
    getDialogs: getDialogs,
    getPeerDialogs: getPeerDialogs,
    searchGlobal: searchGlobal,
    getChats: getChats,
}

export default messages