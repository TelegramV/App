/**
 * @param context
 * @return {function(...[*]=)}
 */
const createResolve = context => {
    return value => {
        if (context.component && context.key) {
            if (context.patchOnly) {
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
 * @return {{Default: *, FireOnly: *, PatchOnly: *}}
 */
function ReactiveCallback(callback) {
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

            return context
        }
    }
}

export default ReactiveCallback