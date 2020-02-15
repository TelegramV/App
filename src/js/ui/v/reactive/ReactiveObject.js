/**
 * (c) Telegram V
 */

import {TypedPublisher} from "../../../api/eventBus/TypedPublisher"
import type {BusEvent} from "../../../api/eventBus/EventBus"
import {EventBus} from "../../../api/eventBus/EventBus"

type ReactiveObjectSubscription = (object: this, event: any) => any

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

        if (this._subscriptions.has(type)) {
            this._subscriptions.get(type).forEach(subscription => subscription(this, event))
        }

        if (this.eventBus) {
            event[this.eventObjectName] = this
            this.eventBus.fire(type, event)
        }
    }
}