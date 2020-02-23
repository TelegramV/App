import VComponent from "./VComponent"

const __withDefaultProps = (context: VComponent, nextProps) => {
    if (context.constructor.defaultProps) {
        for (const [k, v] of Object.entries(context.constructor.defaultProps)) {
            if (nextProps[k] === undefined) {
                nextProps[k] = v
            }
        }
    }

    return nextProps
}

export default __withDefaultProps