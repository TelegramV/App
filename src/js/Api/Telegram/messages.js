import {MTProto} from "../../MTProto/external"
import PeersManager from "../Peers/Objects/PeersManager"
import type {DialogsType, getDialogs_Params_105, getPeerDialogs_Params_105} from "./types"

const getDialogs = (params: getDialogs_Params_105 = {}): Promise<DialogsType> => {
    return MTProto.invokeMethod("messages.getDialogs", {
        exclude_pinned: params.exclude_pinned || false,
        folder_id: params.folder_id || 0,
        offset_date: params.offset_date || 0,
        offset_id: params.offset_id || -1,
        offset_peer: params.offset_peer || {
            _: "inputPeerEmpty",
        },
        limit: params.limit || 20,
        hash: params.hash || ""
    }).then(Dialogs => {
        console.warn("params.folder_id", params.folder_id)
        console.warn("xxx", Dialogs)
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

const getUsers = id => {
    return MTProto.invokeMethod("users.getUsers", {
        id
    }).then(users => {
        return PeersManager.fillPeersFromUpdate({
            users
        }).users
    })
}

const messages = {
    getDialogs: getDialogs,
    getPeerDialogs: getPeerDialogs,
    searchGlobal: searchGlobal,
    getChats: getChats,
    getUsers: getUsers,
}

export default messages