import VF from "../../VFramework"
import VComponent from "./VComponent"

const __unmount = (context: VComponent) => {
    // console.warn("unmounting", context.identifier, context.displayName)
    context.componentWillUnmount()

    context.clearIntervals()
    context.clearTimeouts()

    context.__unregisterReactiveCallbacks()
    context.__unregisterAppEventResolves()
    context.__unregisterReactiveObjectResolves()

    context.$el.__component = undefined
    context.$el = undefined
    context.__.destroyed = true
    context.__.mounted = false

    VF.mountedComponents.delete(context.identifier)
}

export default __unmount