import __diffObjects from "./__diffObjects"
import __withDefaultProps from "./__withDefaultProps"
import VComponent from "./VComponent"

const comparator = (prev, next) => typeof prev === "object" || Array.isArray(prev) || prev !== next

const __diffProps = (context: VComponent, next) => {
    next = __withDefaultProps(context, next, comparator)
    return __diffObjects(context.props, next)
}

export default __diffProps