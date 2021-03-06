/*
 * Telegram V
 * Copyright (C) 2020 Davyd Kohut
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

/**
 * Abstract VCollection.
 *
 * @see VArray
 * @see VSet
 */
class VCollection {

    mutationSubscribers: Set = new Set()

    add(item) {
    }

    addBack(item) {
    }

    clear() {
    }

    delete(index) {
    }

    swap(a, b) {
    }

    set(items) {
    }

    replace(a, b) {
    }

    get items() {
        return null
    }

    size() {
        return this.items.length
    }
}

VCollection.ADD = 0
VCollection.ADD_BACK = 1
VCollection.DELETE = 2
VCollection.CLEAR = 3
VCollection.SWAP = 4
VCollection.SET = 5
VCollection.REPLACE = 6

export default VCollection