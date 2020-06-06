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

import TypedPublisher from "../EventBus/TypedPublisher"

/**
 * Simple Store class
 *
 * @property {Map} _data
 */
export default class MappedStore extends TypedPublisher {
    constructor(props) {
        super()

        if (props.initialData) {
            if (props.initialData instanceof Map) {
                this._data = props.initialData
            } else {
                this._data = new Map()
                console.error("initialData must be of Map type")
            }
        } else {
            this._data = new Map()
        }
    }

    /**
     * @return {Map|Map<any, any>|Map<string, any>}
     */
    get data() {
        return this._data
    }

    /**
     * @param key
     * @param value
     * @return {this}
     */
    set(key, value) {
        this.data.set(key, value)
        return this
    }

    /**
     * @param key
     * @return {*}
     */
    get(key) {
        return this.data.get(key)
    }

    /**
     * @param key
     * @return {boolean}
     */
    has(key) {
        return this.data.has(key)
    }

    /**
     * @param key
     * @return {boolean}
     */
    delete(key) {
        return this.data.delete(key)
    }

    /**
     * @param subscription
     */
    onSet(subscription) {
        this.subscribe("set", subscription)
    }

    /**
     * @param subscription
     */
    onDelete(subscription) {
        this.subscribe("delete", subscription)
    }
}