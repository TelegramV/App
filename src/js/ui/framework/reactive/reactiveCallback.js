/**
 * @param context
 * @return {function(...[*]=)}
 */
const createResolve = context => {
    return value => {
        if (context.component && context.key) {
            if (context.patchOnly) {
                console.log("patch only")
                context.component.reactive[context.key] = value
                context.component.__patch()
            } else if (context.fireOnly) {
                context.component.reactive[context.key] = value
                context.component.changed(context.key, value)
            } else {
                context.component.reactive[context.key] = value
                context.component.changed(context.key, value)
                context.component.__patch()
            }
        }
    }
}

/**
 * Додаємо реактивності і дано-рушійності в компоненти!!!
 *
 * @see AppSelectedDialog.Reactive
 *
 * @param {function(function(*))} callback
 * @param {function(function(*))} offCallback
 * @return {{Default: *, FireOnly: *, PatchOnly: *}}
 */
function ReactiveCallback(callback, offCallback) {
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

            context.__rc = true

            context.resolve = createResolve(context)

            context.defaultValue = callback(context.resolve)
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

            context.resolve = createResolve(context)

            context.defaultValue = callback(context.resolve)
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

            context.resolve = createResolve(context)

            context.defaultValue = callback(context.resolve)
            context.offCallback = offCallback

            return context
        }
    }
}

export default ReactiveCallback