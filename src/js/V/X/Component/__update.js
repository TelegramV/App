import XVComponent from "./XVComponent"
import XVRDOM from "../XVRDOM"

const __update = (context: XVComponent, {isForce = false, nextProps, nextState}) => {
    let shouldUpdate = isForce

    if (!shouldUpdate) {
        if (nextProps) {
            nextProps = {
                ...context.props,
                ...nextProps
            }
        } else {
            nextProps = context.props
        }

        if (nextState) {
            nextState = {
                ...context.state,
                ...nextState
            }
        } else {
            nextState = context.state
        }

        shouldUpdate = context.shouldComponentUpdate(nextProps, nextState) === true
    }

    if (shouldUpdate) {
        if (nextProps) {
            Object.assign(context.props, nextProps)
        }

        if (nextState) {
            Object.assign(context.state, nextState)
        }

        context.__.isUpdatingItSelf = true
        context.$el = XVRDOM.patch(context.$el, context.render())
        context.__.isUpdatingItSelf = false

        context.componentDidUpdate(null, null, null) // todo: pass previous data
    }
}

export default __update