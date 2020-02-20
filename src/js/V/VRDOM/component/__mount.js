import VF from "../../VFramework"
import VComponent from "./VComponent"

const __mount = (context: VComponent, $el: HTMLElement) => {
    context.__.destroyed = false

    if (context.__.mounted) {
        context.__.mounted = true
        // console.warn("remounting component", context.displayName)
        context.$el = $el
        context.$el.__component = context
        context.forceUpdate()
    } else {
        // console.warn("mounting component", context.displayName)
        context.__.mounted = true
        context.$el = $el
        context.$el.__component = context
        context.componentDidMount()
    }

    VF.mountedComponents.set(context.identifier, context)
}

export default __mount