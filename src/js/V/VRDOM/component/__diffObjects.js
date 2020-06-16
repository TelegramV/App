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
 * @param {Object} prevObject
 * @param {Object} nextObject
 * @param {function(prev, next): boolean} comparator
 * @return {boolean|Object} `false` if are equal
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