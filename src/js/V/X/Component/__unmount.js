import XVComponent from "./XVComponent"
import VF from "../../VFramework"

const __unmount = (context: XVComponent) => {
    console.log("unmounting")
    context.componentWillUnmount()
    context.$el.__component = undefined
    context.$el = undefined
    context.__.destroyed = true
    context.__.mounted = false
    VF.mountedComponents.delete(context.identifier)
}

export default __unmount