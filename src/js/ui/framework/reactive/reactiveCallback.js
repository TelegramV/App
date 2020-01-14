/**
 * Додаємо реактивності і дано-рушійності в компоненти!!!
 *
 * @see ReactiveSelectedDialog
 * @param {function(function(*))} callback
 * @return {*|{FireOnly: *, PatchOnly: *}}
 */
const ReactiveCallback = callback => {
    const context = {
        __rc: true,
    }

    context.resolve = (value) => {
        console.log("patchOnly", context)
        if (context.component && context.key) {
            if (context.patchOnly) {
                context.component.state[context.key] = value
                context.component.__patch()
            } else if (context.fireOnly) {
                context.component.changed(context.key, value)
            } else {
                context.component.state[context.key] = value
                context.component.changed(context.key, value)
                context.component.__patch()
            }
        }
    }

    context.default = callback(context.resolve)

    context.FireOnly = {fireOnly: true, ...context}
    context.PatchOnly = {patchOnly: true, ...context}

    return context
}

export default ReactiveCallback