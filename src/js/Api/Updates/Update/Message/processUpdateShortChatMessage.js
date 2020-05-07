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

import PeersStore from "../../../Store/PeersStore";
import API from "../../../Telegram/API";
import MessagesManager from "../../../Messages/MessagesManager";

function processUpdateShortChatMessage(update) {
    const chat = PeersStore.get("chat", update.chat_id)

    if (!chat) {
        API.messages.getChats([update.chat_id]).then(chats => {
            MessagesManager.processNewMessage(chats[0], update);
        });
    } else {
        MessagesManager.processNewMessage(chat, update);
    }
}

export default processUpdateShortChatMessage;