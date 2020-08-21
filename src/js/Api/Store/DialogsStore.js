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

import MappedStore from "./MappedStore"
import {Dialog} from "../Dialogs/Dialog"

class DialogsMapStore extends MappedStore {
    constructor() {
        super({
            initialData: new Map([
                ["chat", new Map()],
                ["chatForbidden", new Map()],
                ["channel", new Map()],
                ["user", new Map()],
            ])
        });

        const jsSet = new Set();
    }

    /**
     * @return {Map<string, Map<number, Dialog>>}
     */
    get data() {
        return super.data
    }

    /**
     * @param {Dialog[]} dialogs
     * @private
     * @return {Dialog[]}
     */
    _sortDialogsArray(dialogs) {
        return dialogs.sort((a, b) => {
            if (!a.messages.last) {
                return 1
            } else if (!b.messages.last) {
                return -1
            } else if (a.messages.last.date > b.messages.last.date) {
                return -1
            } else if (a.messages.last.date < b.messages.last.date) {
                return 1
            } else {
                return 0
            }
        })
    }

    sort(): Dialog[] {
        return this._sortDialogsArray(this.toArray());
    }

    /**
     * @return {number}
     */
    get count() {
        let count = 0

        this.data.forEach(type => {
            count += type.size
        })

        return count
    }

    /**
     * @param {string} type
     * @param {number} id
     * @return {Dialog|boolean}
     */
    get(type, id) {
        if (this.data.has(type)) {
            return this.data.get(type).get(id) || false
        } else {
            return false
        }
    }

    /**
     * @return {Array<Dialog>}
     */
    toArray() {
        const array = [];
        for (const [_, data] of this.data.entries()) {
            for (const [_, dialog] of data.entries()) {
                array.push(dialog)
            }
        }
        return array;
    }

    /**
     * @param folderId
     * @return {Array<Dialog>}
     */
    getAllInFolder(folderId) {
        const folder = []

        this.data.forEach(type => {
            type.forEach(dialog => {
                if (dialog.folderId === folderId) {
                    folder.push(dialog)
                }
            })
        })

        return folder
    }

    /**
     * @param {Dialog} dialog
     * @return {this}
     */
    set(dialog) {
        if (!dialog) {
            console.error("BUG (DialogsStore): invalid peer was provided!")
            return this
        }

        if (this.data.has(dialog.peer.type)) {
            this.data
                .get(dialog.peer.type)
                .set(dialog.peer.id, dialog)
            this.fire("set", {dialog})
            return this
        } else {
            console.error("invalid dialog type")
            return this
        }
    }

    deleteDialog(dialog) {
        if (this.data.has(dialog.peer.type)) {
            this.data.get(dialog.peer.type).delete(dialog.peer.id)
            this.fire("delete", {
                dialog: {
                    type: dialog.peer.type,
                    id: dialog.peer.id,
                }
            })
            return this
        } else {
            console.error("invalid dialog type")
            return this
        }
    }

    /**
     * @param {Array<Dialog>} dialogs
     * @return {this}
     */
    setMany(dialogs) {
        for (const dialog of dialogs) {
            this.set(dialog)
        }

        return this
    }

    /**
     * @param {string} username
     * @return {Dialog|boolean}
     */
    getByUsername(username) {
        return this.find(dialog => dialog.peer.username === username)
    }

    /**
     * @param peer
     */
    getByPeer(peer) {
        return this.get(peer.type, peer.id)
    }

    /**
     * @param {function(dialog: Dialog): boolean} predicate
     * @return {Dialog|boolean}
     */
    find(predicate) {
        for (const [_, data] of this.data.entries()) {
            for (const [_, dialog] of data.entries()) {
                if (predicate(dialog)) {
                    return dialog
                }
            }
        }

        return false
    }

    /**
     * @param {string} type
     * @param {function(dialog: Dialog): boolean} predicate
     * @return {Dialog|boolean}
     */
    findWithType(type, predicate) {
        if (this.data.has(type)) {
            for (const [_, dialog] of this.data.get(type).entries()) {
                if (predicate(dialog)) {
                    return dialog
                }
            }
        } else {
            console.error("invalid dialog type")
        }

        return false
    }

    /**
     * @param {string} type
     * @param {number} id
     * @return {boolean}
     */
    has(type, id) {
        return this.data.get(type).has(id)
    }

    /**
     *
     * @param {function(dialog: Dialog)} subscription
     */
    onSet(subscription) {
        super.onSet(subscription)
    }
}

const DialogsStore = new DialogsMapStore()

export default DialogsStore