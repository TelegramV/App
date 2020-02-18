import XVComponent from "./XVComponent"
import __withDefaultProps from "./__withDefaultProps"

const __diffProps = (context: XVComponent, nextProps) => {
    nextProps = __withDefaultProps(context, nextProps)
    const diffProps = {}

    for (const [k, v] of Object.entries(nextProps)) {
        if (context.props[k] !== v) {
            diffProps[k] = v
        }
    }

    return Object.keys(diffProps).length > 0 ? diffProps : false
}

export default __diffProps