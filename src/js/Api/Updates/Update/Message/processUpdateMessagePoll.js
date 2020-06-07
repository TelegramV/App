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

import AppSelectedChat from "../../../../Ui/Reactive/SelectedChat"
import messagesApi from "../../../Telegram/messages"

function processUpdateMessagePoll(update) {
    if (AppSelectedChat.isSelected) {
        // todo: @prettydude fix it pls
        const messages = AppSelectedChat.current.messages.getPollsById(update.poll_id);

        for (const message of messages) {
        	if(update.poll?.min || update.results?.min) {
        		messagesApi.getPollResults(message); //ask for full, if getting min
        		return;
        	}
            message.fillPoll(update.poll, update.results);
            message.fire("pollEdit");
        }
    }
}

export default processUpdateMessagePoll;