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

function getTopPeers(params = {}) {
    return MTProto.invokeMethod("contacts.getTopPeers", params).then(TopPeers => {
        PeersManager.fillPeersFromUpdate(TopPeers)

        return TopPeers
    })
}

function resolveUsername(username) {
    return MTProto.invokeMethod("contacts.resolveUsername", {
        username
    }).then(resolved => {
        return PeersManager.fillPeersFromUpdate(resolved)
    })
}

function getBlocked(limit = 20, offset = 0) {
    return MTProto.invokeMethod("contacts.getBlocked", {
        offset,
        limit
    }).then(blocked => {
        PeersManager.fillPeersFromUpdate(blocked)
        return blocked
    })
}

function block(peer) {
    return MTProto.invokeMethod("contacts.block", {
        id: peer.inputPeer
    });
}

function unblock(peer) {
    return MTProto.invokeMethod("contacts.unblock", {
        id: peer.inputPeer
    });
}

const contacts = {
    getTopPeers,
    resolveUsername,
    getBlocked,
    block,
    unblock,
}

export default contacts