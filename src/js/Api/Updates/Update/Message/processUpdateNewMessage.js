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

import {getPeerTypeFromType} from "../../../Dialogs/util";
import PeersStore from "../../../Store/PeersStore";
import MTProto from "../../../../MTProto/External";
import MessagesManager from "../../../Messages/MessagesManager";

function processUpdateNewMessage(update) {
    let peer;

    if (update.message.out) {
        const peerType = getPeerTypeFromType(update.message.to_id._);
        peer = PeersStore.get(peerType, update.message.to_id[`${peerType}_id`]);
    } else if (update.message.to_id && update.message.to_id.user_id !== MTProto.getAuthorizedUserId()) {
        const peerType = getPeerTypeFromType(update.message.to_id._);
        peer = PeersStore.get(peerType, update.message.to_id[`${peerType}_id`]);
    } else {
        peer = PeersStore.get("user", update.message.from_id);
    }

    MessagesManager.processNewMessage(peer, update.message);
}

export default processUpdateNewMessage;