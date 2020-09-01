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

import SharedState from "../../V/VRDOM/component/SharedState"
import FoldersManager from "../../Api/Dialogs/FolderManager"
import AppEvents from "../../Api/EventBus/AppEvents"

class FoldersState extends SharedState {
    currentId = null;
    folders = [];

    constructor() {
        super();

        AppEvents.General.subscribe("foldersUpdate", this.onFoldersUpdate);
        AppEvents.General.subscribe("selectFolder", this.onSelectFolder);


        // TODO fetch only when needed
        //FoldersManager.fetchFolders();
    }

    init() {
        FoldersManager.fetchFolders();
    }

    get current() {
        return this.folders.find(folder => folder.id === this.currentId)
    }

    setCurrent(folderId) {
        this.set({
            currentId: folderId,
        });
    }

    setFolders(folders) {
        this.set({
            folders: folders,
        });
    }

    onFoldersUpdate = ({folders}) => {
        this.setFolders(folders);
    }

    onSelectFolder = ({folderId}) => {
        this.setCurrent(folderId);
    }
}

export default new FoldersState();