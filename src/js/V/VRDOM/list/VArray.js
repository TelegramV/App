/*
 * Copyright 2020 Telegram V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

    addBack(item) {
        this.back.push(item)
        ++(this.backLen)
        this.mutationSubscribers.forEach(s => s(VCollection.ADD_BACK, {item, key: -this.backLen}))
    }

    clear() {
        this.array = []
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
        this.array = items
        this.back = []
        this.arrayLen = items.length - 1
        this.backLen = 0
        this.mutationSubscribers.forEach(s => s(VCollection.SET))
    }

    get items() {
        return this.array
    }
}

export default VArray