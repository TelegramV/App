import XVComponent from "./XVComponent"

const __init = (context: XVComponent) => {
    if (!context.__.inited) {
        context.init = context.init.bind(context)
        context.render = context.render.bind(context)
        context.componentDidMount = context.componentDidMount.bind(context)
        context.shouldComponentUpdate = context.shouldComponentUpdate.bind(context)
        context.componentDidUpdate = context.componentDidUpdate.bind(context)
        context.setState = context.setState.bind(context)
        context.forceUpdate = context.forceUpdate.bind(context)

        context.__update = context.__update.bind(context)
        context.__unmount = context.__unmount.bind(context)

        context.init.apply(context)

        context.__.inited = true
    } else {
        console.error("BUG: component is already inited!")
    }
}

export default __init