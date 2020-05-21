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

import TypedPublisher from "../../Api/EventBus/TypedPublisher"
import type {BusEvent} from "../../Api/EventBus/EventBus"
import {EventBus} from "../../Api/EventBus/EventBus"

type ReactiveObjectSubscription = (object: this, event: any) => any

// should be probably moved somewhere else
export class ReactiveObject extends TypedPublisher<ReactiveObjectSubscription, BusEvent> {

    eventBus: EventBus = undefined
    eventObjectName: string = "object"

    /**
     * @param {string} type
     * @param {BusEvent} event
     */
    fire(type: string, event: BusEvent = {}) {

        Object.assign(event, {
            type
        })

        this._subscriptions.get("*").forEach(subscription => subscription(this, event))

        const commits = []

        if (this._subscriptions.has(type)) {
            this._subscriptions.get(type).forEach(s => commits.push(s))
        }

        commits.forEach(subscription => subscription(this, event))

        if (this.eventBus) {
            event[this.eventObjectName] = this
            this.eventBus.fire(type, event)
        }
    }
}