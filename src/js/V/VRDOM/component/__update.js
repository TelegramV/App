import __diffProps from "./__diffProps"
import VComponent from "./VComponent"

const __update = (context: VComponent, {isForce = false, nextProps, nextState}) => {
    let shouldUpdate = isForce

    if (!isForce) {
        let hasNextState = false

        if (nextState) {
            hasNextState = true
            nextState = {
                ...context.state,
                ...nextState
            }
        } else {
            nextState = context.state
        }

        if (nextProps) {
            nextProps = {
                ...context.props,
                ...nextProps
            }
        } else {
            nextProps = context.props
        }

        shouldUpdate = context.shouldComponentUpdate(nextProps, nextState)

        if (shouldUpdate === undefined) {
            const diffProps = __diffProps(context, nextProps) // there is a better and faster way to do this, but no time to implement
            shouldUpdate = hasNextState || diffProps !== false
        }

        shouldUpdate = shouldUpdate !== false
    }

    if (shouldUpdate) {
        if (nextProps) {
            Object.assign(context.props, nextProps)
        }

        if (nextState) {
            Object.assign(context.state, nextState)
        }

        context.__.isUpdatingItSelf = true
        context.$el = VRDOM.patch(context.$el, context.__render())
        context.__.isUpdatingItSelf = false

        context.componentDidUpdate(null, null, null) // todo: pass previous data
    }
}

export default __update