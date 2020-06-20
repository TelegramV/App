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
import {Peer} from "../Peers/Objects/Peer"
import UpdatesManager from "../Updates/UpdatesManager"

function deleteMessages(peer: Peer, id: number[]) {
    return MTProto.invokeMethod("channels.deleteMessages", {
        channel: peer.input,
        id,
    }).then(affectedMessages => {
        if (UpdatesManager.channelUpdatesProcessor.processAffectedMessages(peer, affectedMessages)) {
            UpdatesManager.channelUpdatesProcessor.enqueue({
                ...affectedMessages,
                channel_id: peer.id,
                messages: id,
                _: "updateDeleteChannelMessages",
            });
        }

        return affectedMessages;
    })
}

function joinChannel(peer: Peer) {
    return MTProto.invokeMethod("channels.joinChannel", {
        channel: peer.input,
    }).then(Updates => {
        UpdatesManager.process(Updates);

        return Updates;
    })
}

function leaveChannel(peer: Peer) {
    return MTProto.invokeMethod("channels.leaveChannel", {
        channel: peer.input,
    }).then(Updates => {
        UpdatesManager.process(Updates);

        return Updates;
    })
}

const channels = {
    deleteMessages: deleteMessages,
    joinChannel: joinChannel,
    leaveChannel: leaveChannel,
}

export default channels