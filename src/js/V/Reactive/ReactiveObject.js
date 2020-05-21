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