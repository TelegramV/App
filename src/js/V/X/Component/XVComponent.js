import __update from "./__update"
import __init from "./__init"
import __mount from "./__mount"
import __unmount from "./__unmount"
import __withDefaultProps from "./__withDefaultProps"

class XVComponent {

    __ = {
        inited: false,
        mounted: false,
        destroyed: false,

        isUpdatingItSelf: false,

    }

    static defaultProps = undefined

    displayName = this.constructor.name

    props = {}
    state = {}

    $el: HTMLElement

    constructor(props) {
        this.props = __withDefaultProps(this, props.props)
    }

    // you can call it componentDidInit
    init() {

    }

    render() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    setState(nextState) {
        if (typeof nextState === "function") {
            this.__setState(nextState(this.state))
        } else {
            this.__setState(nextState)
        }
    }

    forceUpdate() {
        this.__update({
            isForce: true
        })
    }

    __init() {
        return __init(this)
    }

    __setState(nextState) {
        this.__update({
            nextState
        })
    }

    __update(props) {
        return __update(this, props)
    }

    __unmount() {
        return __unmount(this)
    }

    __mount($el: HTMLElement) {
        return __mount(this, $el)
    }
}

export default XVComponent