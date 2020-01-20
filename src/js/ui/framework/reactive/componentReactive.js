/**
 * Цетралізує логіку оброблення оновлень реактивних значень в компонентах. Тільки в компонентах.
 *
 * Про користь цієї штуки я поки не буду говорити, але в теорії воно має працювати швидше ніж {@link ReactiveCallback}.
 *
 * WARNING: NOT IMPLEMENTED NOW!
 *
 * @see ReactiveCallback
 *
 * @param {function(*)} callback
 * @param {function(*)} offCallback
 * @param {undefined|function(*)} customFilter
 * @return {{Default: *, FireOnly: *, PatchOnly: *}}
 */
function ComponentReactive(callback, offCallback, customFilter = undefined) {
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

            context.__r_component = true

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

            context.__rc = true
            context.fireOnly = true

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

            context.__rc = true
            context.patchOnly = true

            context.callback = callback
            context.offCallback = offCallback

            return context
        }
    }
}

export default ComponentReactive