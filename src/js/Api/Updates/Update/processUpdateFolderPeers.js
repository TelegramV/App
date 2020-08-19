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

import DialogsManager from "../../Dialogs/DialogsManager"
import AppEvents from "../../EventBus/AppEvents"

function processUpdateFolderPeers(update) {
    update.folder_peers.forEach(FolderPeer => {
        const dialog = DialogsManager.findByPeer(FolderPeer.peer);

        if (dialog) {
            dialog.folderId = FolderPeer.folder_id;
        } else {
            console.error("BUG: whoa!!! this thing is not implemented yet");
        }
    });

    AppEvents.Telegram.fire("updateFolderPeers", update);
}

export default processUpdateFolderPeers