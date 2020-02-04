/**
 * Реактивні івенти в компонентах. Документація колись буде..
 *
 * @see ReactiveCallback
 *
 * @param {EventBus} bus EventBus from which event will be fired
 * @param {function(function(*))} callback анонімна функція, що приймає за параметр обробника реактивного оновлення. В компонентах він або патчить (__patch), або викликає changed.
 * @param {function(function(*))} offCallback анонімна функція, приймає обробника (того самого що в попередньому параметрі) параметром, якого має видаляти з нижчого (чи вищого, я запутався) рівня і більше НІКОЛИ не виконувати. Викликається під час видалення компонента.
 * @return {{Default: *, FireOnly: *, PatchOnly: *}}
 *
 * @deprecated
 */
function ReactiveEvent(bus, callback, offCallback) {
    if (typeof callback !== "function") {
        throw new Error("callback is not a function")
    }

    if (typeof offCallback !== "function") {
        throw new Error("offCallback is not a function")
    }

    return {
        /**
         * Means that both `__patch` and `changed` will be called.
         *
         * @return {*}
         */
        get Default() {
            const context = Object.create(null)

            context.__re = true

            context.bus = bus
            context.callback = callback
            context.offCallback = offCallback

            return context
        },

        /**
         * Means that the only `changed` will be called. No re-rendering.
         *
         * @return {*}
         */
        get FireOnly() {
            const context = Object.create(null)

            context.__re = true
            context.fireOnly = true

            context.bus = bus
            context.callback = callback
            context.offCallback = offCallback

            return context
        },

        /**
         * Means that the only `__patch` will be called.
         *
         * @return {*}
         */
        get PatchOnly() {
            const context = Object.create(null)

            context.__re = true
            context.patchOnly = true

            context.bus = bus
            context.callback = callback
            context.offCallback = offCallback

            return context
        }
    }
}

export default ReactiveEvent