import MTProto from "../../MTProto/External"
import PeersManager from "../Peers/PeersManager"
import type {getDialogs_Params_105} from "./types"
import {Peer} from "../Peers/Objects/Peer"

function getDialogs(params: getDialogs_Params_105 = {}) {
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
        PeersManager.fillPeersFromUpdate(Dialogs)

        Dialogs.count = Dialogs.count || Dialogs.dialogs.length
        Dialogs.__limit = params.limit || 20

        return Dialogs
    })
}

function getPeerDialogs({peers}) {
    return MTProto.invokeMethod("messages.getPeerDialogs", {
        peers
    }).then(Dialogs => {
        PeersManager.fillPeersFromUpdate(Dialogs)

        Dialogs.count = Dialogs.count || Dialogs.dialogs.length

        return Dialogs
    })
}

function searchGlobal(params) {
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

function getChats(id) {
    return MTProto.invokeMethod("messages.getChats", {
        id
    }).then(Chats => {
        return PeersManager.fillPeersFromUpdate(Chats).chats
    })
}

function getHistory(peer: Peer, params = {
    offset_id: 0,
    offset_date: 0,
    add_offset: 0,
    limit: 50,
    max_id: 0,
    min_id: 0,
    hash: 0,
}): { messages: []; } {
    params.peer = peer.inputPeer;

    return MTProto.invokeMethod("messages.getHistory", params).then(Messages => {
        if (Messages._ === "messages.channelMessages" && peer.dialog) {
            peer.dialog.pts = Messages.pts;
        }

        PeersManager.fillPeersFromUpdate(Messages);

        return Messages;
    })
}

const messages = {
    getDialogs: getDialogs,
    getPeerDialogs: getPeerDialogs,
    searchGlobal: searchGlobal,
    getChats: getChats,
    getHistory: getHistory,
}

export default messages