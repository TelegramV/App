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

import AppEvents from "../../../EventBus/AppEvents";

function processUpdateMessageID(update) {
    // update.dialog && update.dialog.handleUpdateMessageID(update.id, update.random_id);
    if (update.dialog) {
        const message = update.dialog.peer.messages.getById(update.random_id);

        console.log("XXX", message);

        if (message) {
            message.raw.id = update.id;
            message.raw.random_id = update.random_id;
        }
    }

    AppEvents.Telegram.fire("updateMessageID", update);
}

export default processUpdateMessageID;