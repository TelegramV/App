import VComponent from "../../../V/VRDOM/component/VComponent"

export default class PaneComponent extends VComponent {
    constructor(props) {
        super(props)
    }

    set isShown(value) {
        this.state.isShown = value
        this.forceUpdate()
    }
}