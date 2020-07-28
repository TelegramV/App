/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import MTProto from "../../MTProto/External"
import PeersManager from "../Peers/PeersManager"
import {Peer} from "../Peers/Objects/Peer"
import UpdatesManager from "../Updates/UpdatesManager"

function getDialogs(params = {}) {
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

/*function getMessageReactionsList(inputPeer, msg_id, limit = 10, reaction = undefined, offset = undefined) {
    return MTProto.invokeMethod("messages.getMessageReactionsList", {
        peer: inputPeer,
        id: msg_id,
        reaction: reaction,
        offset: offset,
        limit: limit
    })
}*/

function sendReaction(inputPeer, msg_id, reaction = undefined) {
    return MTProto.invokeMethod("messages.sendReaction", {
        peer: inputPeer,
        msg_id: msg_id,
        reaction: reaction,
    }).then(updates => {
        UpdatesManager.process(updates)
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
}): Promise<{ messages: []; }> {
    params.peer = peer.inputPeer;

    return MTProto.invokeMethod("messages.getHistory", params).then(Messages => {
        if (Messages._ === "messages.channelMessages" && peer.dialog) {
            peer.dialog.pts = Messages.pts;
        }

        PeersManager.fillPeersFromUpdate(Messages);

        return Messages;
    })
}

function getAllStickers({hash = 0} = {hash: 0}) {
    return MTProto.invokeMethod("messages.getAllStickers", {hash})
}

function getRecentStickers({hash = 0} = {hash: 0}) {
    return MTProto.invokeMethod("messages.getRecentStickers", {hash})
}

function getFeaturedStickers({hash = 0} = {hash: 0}) {
    return MTProto.invokeMethod("messages.getFeaturedStickers", {hash})
}

function getFavedStickers({hash = 0} = {hash: 0}) {
    return MTProto.invokeMethod("messages.getFavedStickers", {hash})
}

function searchStickerSets(q, excludeFeatured = false, hash = 0) {
    return MTProto.invokeMethod("messages.searchStickerSets", {
        q: q,
        exclude_featured: excludeFeatured,
        hash: hash,
    })
}

function installStickerSet(inputStickerSet, archive = false) {
    return MTProto.invokeMethod("messages.installStickerSet", {
        stickerset: inputStickerSet,
        archived: archive
    })
}

function uninstallStickerSet(inputStickerSet) {
    return MTProto.invokeMethod("messages.uninstallStickerSet", {
        stickerset: inputStickerSet
    })
}

function getSavedGifs({hash = 0} = {hash: 0}) {
    return MTProto.invokeMethod("messages.getSavedGifs", {hash})
}

function getStickerSet(props) {
    return MTProto.invokeMethod("messages.getStickerSet", props)
}

function deleteMessages(id: number[], revoke = true) {
    return MTProto.invokeMethod("messages.deleteMessages", {
        revoke,
        id,
    }).then(affectedMessages => {
        if (UpdatesManager.defaultUpdatesProcessor.processAffectedMessages(affectedMessages)) {
            UpdatesManager.defaultUpdatesProcessor.enqueue({
                ...affectedMessages,
                messages: id,
                _: "updateDeleteMessages",
            });
        }

        return affectedMessages
    })
}

function updatePinnedMessage(message) {
    return MTProto.invokeMethod("messages.updatePinnedMessage", {
        peer: message.dialogPeer.inputPeer,
        id: message.isPinned ? -1 : message.id,
    }).then(updates => {
        UpdatesManager.process(updates)
    })
}

function sendVote(message, answers) {
    return MTProto.invokeMethod("messages.sendVote", {
        peer: message.from.inputPeer,
        msg_id: message.id,
        options: answers
    }).then(response => {
        UpdatesManager.process(response);
        return response;
    });
}

function closePoll(message) {
    if(!message.poll) return;
    message.poll.closed = true;
    let poll = {
        _: "inputMediaPoll",
        poll: message.poll,
        correct_answers: message.results?.results?.filter(res => res.correct)?.map(res => res.option),
        solution: message.results?.solution,
        solution_entities: message.result?.solution_entities
    }

    return MTProto.invokeMethod("messages.editMessage", {
        no_webpage: false,
        peer: message.from.inputPeer,
        id: message.id,
        message: message.text,
        media: poll,
        reply_markup: message.replyMarkup,
        entities: message.raw.entities,
        schedule_date: 0
    }).then(updates => {
        UpdatesManager.process(updates)
    })
}

function getPollResults(message) {
    return MTProto.invokeMethod("messages.getPollResults", {
        peer: message.dialogPeer.inputPeer,
        msg_id: message.id
    }).then(updates => {
        UpdatesManager.process(updates)
    })
}

function getPollVotes(message, option = null, offset = null, limit = 42) {
    return MTProto.invokeMethod("messages.getPollVotes", {
        peer: message.dialogPeer.inputPeer,
        id: message.id,
        option: option,
        offset: offset,
        limit: limit,
    })
}

const messages = {
    getDialogs: getDialogs,
    getPeerDialogs: getPeerDialogs,
    searchGlobal: searchGlobal,
    getChats: getChats,
    getHistory: getHistory,
    getAllStickers: getAllStickers,
    getRecentStickers: getRecentStickers,
    getFeaturedStickers: getFeaturedStickers,
    getFavedStickers: getFavedStickers,
    searchStickerSets: searchStickerSets,
    installStickerSet: installStickerSet,
    uninstallStickerSet: uninstallStickerSet,
    getSavedGifs: getSavedGifs,
    getStickerSet: getStickerSet,
    deleteMessages: deleteMessages,
    updatePinnedMessage: updatePinnedMessage,
    sendVote: sendVote,
    closePoll: closePoll,
    getPollResults: getPollResults,
    getPollVotes: getPollVotes,
    sendReaction: sendReaction,
    //getMessageReactionsList: getMessageReactionsList,
}

export default messages