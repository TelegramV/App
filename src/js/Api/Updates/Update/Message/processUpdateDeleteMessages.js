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

import DialogsStore from "../../../Store/DialogsStore"

// todo rewrite
function processUpdateDeleteMessages(update) {
    DialogsStore.toArray().forEach(dialog => {
        if (dialog.peer.type !== "channel") {
            dialog.peer.messages.startTransaction();

            update.messages.sort().forEach(mId => {
                dialog.peer.messages.deleteSingle(mId);
            })

            if (!dialog.peer.messages.last) {
                dialog.refresh();
            }

            dialog.peer.messages.fireTransaction("deleteMessages", {
                messages: update.messages
            });
        }
    });
}

export default processUpdateDeleteMessages;