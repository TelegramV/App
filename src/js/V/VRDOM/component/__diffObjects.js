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
 * @param {Object} prevObject
 * @param {Object} nextObject
 * @param {function(prev, next): boolean} comparator
 * @return {boolean|Object}
 */
const __diffObjects = (prevObject, nextObject, comparator) => {
    const diff = {}

    for (const [k, v] of Object.entries(nextObject)) {
        const oldV = prevObject[k]

        if (comparator) {
            if (comparator.call(null, oldV, v)) {
                diff[k] = v
            }
        } else if (oldV !== v) {
            diff[k] = v
        }
    }

    return Object.keys(diff).length > 0 ? diff : false
}

export default __diffObjects