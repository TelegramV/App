import {Publisher} from "./Publisher"
import type {BusEvent} from "./EventBus"

export type ReactiveSubscription = (value: any, event: BusEvent) => any

export class ReactivePublisher<T: ReactiveSubscription, E: BusEvent> extends Publisher<T, E> {

    reactiveSubscribe(subscription: T) {

    }
}