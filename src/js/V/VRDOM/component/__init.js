import VComponent from "./VComponent"
import {registerAppEvents} from "./appEvents"
import {registerReactive} from "./reactive"

const __init = (context: VComponent) => {
    if (!context.__.inited) {
        context.init = context.init.bind(context)
        context.render = context.render.bind(context)
        context.componentDidMount = context.componentDidMount.bind(context)
        context.shouldComponentUpdate = context.shouldComponentUpdate.bind(context)
        context.componentDidUpdate = context.componentDidUpdate.bind(context)
        context.setState = context.setState.bind(context)
        context.forceUpdate = context.forceUpdate.bind(context)

        context.__update = context.__update.bind(context)
        context.__mount = context.__mount.bind(context)
        context.__unmount = context.__unmount.bind(context)
        context.__render = context.__render.bind(context)

        context.appEvents = context.appEvents.bind(context)
        context.reactive = context.reactive.bind(context)

        context.__unregisterAppEventResolves = context.__unregisterAppEventResolves.bind(context)
        context.__unregisterAppEventResolve = context.__unregisterAppEventResolve.bind(context)
        context.__recreateAppEventsResolves = context.__recreateAppEventsResolves.bind(context)

        context.__registerReactiveObjectResolve = context.__registerReactiveObjectResolve.bind(context)
        context.__unregisterReactiveObjectResolves = context.__unregisterReactiveObjectResolves.bind(context)
        context.__unregisterReactiveObjectResolve = context.__unregisterReactiveObjectResolve.bind(context)
        context.__recreateReactiveObjects = context.__recreateReactiveObjects.bind(context)

        context.__registerReactiveCallbacks = context.__registerReactiveCallbacks.bind(context)
        context.__registerReactiveObjectCallbackResolve = context.__registerReactiveObjectCallbackResolve.bind(context)
        context.__unregisterReactiveCallbacks = context.__unregisterReactiveCallbacks.bind(context)

        context.withInterval = context.withInterval.bind(context)
        context.withTimeout = context.withTimeout.bind(context)
        context.clearIntervals = context.clearIntervals.bind(context)
        context.clearTimeouts = context.clearTimeouts.bind(context)

        context.init.call(context)

        context.__registerReactiveCallbacks()

        context.appEvents(registerAppEvents(context))
        context.reactive(registerReactive(context))

        context.__.inited = true
    } else {
        console.error("BUG: component is already inited!")
    }
}

export default __init