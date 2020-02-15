/**
 * (c) Telegram V
 */

import type {ReactiveSubscription} from "../../../api/eventBus/ReactivePublisher"

type Subscribe = (subscription: ReactiveSubscription) => any
type Unsubscribe = (subscription: ReactiveSubscription) => any

export type DefaultReactiveCallbackContext = {
    __rc: boolean,

    subscribe: Subscribe,
    unsubscribe: Unsubscribe,

    subscription: ReactiveSubscription
}

export type FireOnlyReactiveCallbackContext = DefaultReactiveCallbackContext & {
    fireOnly: boolean
}

export type PatchOnlyReactiveCallbackContext = DefaultReactiveCallbackContext & {
    patchOnly: boolean
}

export type ReactiveCallbackContext =
    DefaultReactiveCallbackContext
    | FireOnlyReactiveCallbackContext
    | PatchOnlyReactiveCallbackContext

/**
 * Додаємо реактивності і дано-рушійності в компоненти!!!
 *
 * @see AppSelectedPeer.Reactive
 *
 * @param {function(function(*))} subscribe анонімна функція, що приймає за параметр обробника реактивного оновлення. В компонентах він або патчить (__patch), або викликає reactiveChanged.
 * @param {function(function(*))} unsubscribe анонімна функція, приймає обробника (того самого що в попередньому параметрі) параметром, якого має видаляти з нижчого (чи вищого, я запутався) рівня і більше НІКОЛИ не виконувати. Викликається під час видалення компонента.
 * @return {{Default: ReactiveCallbackContext, FireOnly: FireOnlyReactiveCallbackContext, PatchOnly: PatchOnlyReactiveCallbackContext}}
 */
function ReactiveCallback(subscribe: Subscribe, unsubscribe: Unsubscribe) {
    if (typeof subscribe !== "function") {
        throw new Error("callback is not a function")
    }

    if (typeof unsubscribe !== "function") {
        throw new Error("offCallback is not a function")
    }

    return {
        /**
         * Means that both `__patch` and `reactiveChanged` will be called.
         *
         * @return {*}
         */
        get Default() {
            const context: DefaultReactiveCallbackContext = Object.create(null)

            context.__rc = true

            context.subscribe = subscribe
            context.unsubscribe = unsubscribe

            return context
        },

        /**
         * Means that the only `reactiveChanged` will be called. No re-rendering.
         *
         * @return {*}
         */
        get FireOnly(): FireOnlyReactiveCallbackContext {
            const context: FireOnlyReactiveCallbackContext = Object.create(null)

            context.__rc = true
            context.fireOnly = true

            context.subscribe = subscribe
            context.unsubscribe = unsubscribe

            return context
        },

        /**
         * Means that the only `__patch` will be called.
         *
         * @return {*}
         */
        get PatchOnly(): PatchOnlyReactiveCallbackContext {
            const context: PatchOnlyReactiveCallbackContext = Object.create(null)

            context.__rc = true
            context.patchOnly = true

            context.subscribe = subscribe
            context.unsubscribe = unsubscribe

            return context
        }
    }
}

export default ReactiveCallback