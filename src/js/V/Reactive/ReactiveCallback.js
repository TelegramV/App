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
 * @deprecated never use it
 *
 * UPD 2020: huh, it was funny to write this, even if this is completely useless now
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