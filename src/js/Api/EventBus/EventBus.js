import {TypedPublisher} from "./TypedPublisher"

export type BusEvent = {
    type: string,
    bus: EventBus,
    [string]: any,
}

/**
 * Simple BusEvent Bus class
 */
export class EventBus extends TypedPublisher {

    /**
     * @param {function({
     *     type: string,
     *     peer: Peer,
     *     dialog: Dialog,
     *     message: Message,
     *     messages: Message[],
     * })} subscription
     */
    subscribeAny(subscription) {
        super.subscribeAny(subscription)
    }

    condition(condition, type: string, callback: BusEvent => any) {
        console.error(this, `[${type}] -> [${condition}] conditions are not implemented`)
    }
}