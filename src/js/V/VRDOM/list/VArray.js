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

import VCollection from "./VCollection"

class VArray extends VCollection {

    back: Array
    array: Array

    arrayLen: number
    backLen: number

    key: any

    constructor(items: Array = [], key = undefined) {
        super()
        this.array = items
        this.back = []
        this.arrayLen = items.length - 1
        this.backLen = 0

        this.key = key
    }

    add(item) {
        this.array.push(item)
        ++(this.arrayLen)
        this.mutationSubscribers.forEach(s => s(VCollection.ADD, {item, key: this.arrayLen}))
    }

    addMany(items) {
        items.forEach(item => this.add(item))
    }

    addBack(item) {
        this.back.push(item)
        ++(this.backLen)
        this.mutationSubscribers.forEach(s => s(VCollection.ADD_BACK, {item, key: -this.backLen}))
    }

    clear() {
        this.back = []
        this.array = []
        this.backLen = 0
        this.arrayLen = 0

        this.mutationSubscribers.forEach(s => s(VCollection.CLEAR, {}))
    }

    delete(key) {
        if (key < 0) {
            delete this.array[+key + 1]
            this.mutationSubscribers.forEach(s => s(VCollection.DELETE, {key}))
        } else {
            delete this.array[key]
            this.mutationSubscribers.forEach(s => s(VCollection.DELETE, {key}))
        }
    }

    swap(key1, key2) {
        const temp = this.array[key1]
        this.array[key1] = this.array[key2]
        this.array[key2] = temp
        this.mutationSubscribers.forEach(s => s(VCollection.SWAP, {index1: key1, index2: key2}))
    }

    set(items) {
        if (items !== this.array) {
            this.array = items
            this.back = []
            this.arrayLen = items.length - 1
            this.backLen = 0
            this.mutationSubscribers.forEach(s => s(VCollection.SET))
        }
    }

    get items() {
        return this.back.concat(this.array)
    }
}

export default VArray