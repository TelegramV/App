import XVComponent from "./XVComponent"
import VF from "../../VFramework"

const __mount = (context: XVComponent, $el: HTMLElement) => {
    if (context.__.destroyed) {
        console.error("BUG: component was already destroyed, wtf")
    }

    if (context.__.mounted) {
        console.warn("remounting component", context.displayName)
        context.$el = $el
        context.$el.__component = context
        context.forceUpdate()
        context.__.mounted = true
    } else {
        console.warn("mounting component", context.displayName)
        context.$el = $el
        context.$el.__component = context
        context.componentDidMount()
        context.__.mounted = true
    }
    context.identifier = Math.random()
    VF.mountedComponents.set(context.identifier, context)
}

export default __mount