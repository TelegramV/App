import {TypedPublisher} from "../../../api/eventBus/TypedPublisher"
import type {BusEvent} from "../../../api/eventBus/EventBus"

type ReactiveObjectSubscription = (object: this, event: any) => any

export class ReactiveObject extends TypedPublisher<ReactiveObjectSubscription, BusEvent> {

    /**
     * @param {*} type
     * @param event
     */
    fire(type: any, event: BusEvent = {}) {

        Object.assign(event, {
            type
        })
        this._subscriptions.get("*").forEach(subscription => subscription(this, event))

        if (this._subscriptions.has(type)) {
            this._subscriptions.get(type).forEach(subscription => subscription(this, event))
        }
    }
}