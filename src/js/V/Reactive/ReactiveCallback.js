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

import type {BusEvent} from "../../Api/EventBus/EventBus"

export type ReactiveSubscription = (value: any, event: BusEvent) => any

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
 * @param {function(function(*))} subscribe анонімна функція, що приймає за параметр обробника реактивного оновлення. В компонентах він або патчить (__patch), або викликає reactiveChanged.
 * @param {function(function(*))} unsubscribe анонімна функція, приймає обробника (того самого що в попередньому параметрі) параметром, якого має видаляти з нижчого (чи вищого, я запутався) рівня і більше НІКОЛИ не виконувати. Викликається під час видалення компонента.
 * @return {{Default: ReactiveCallbackContext, FireOnly: FireOnlyReactiveCallbackContext, PatchOnly: PatchOnlyReactiveCallbackContext}}
 */
function ReactiveCallback(subscribe: Subscribe, unsubscribe: Unsubscribe) {
    console.warn("reactive callbacks are deprecated")

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