/*
 * Copyright 2020 Telegram V authors.
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