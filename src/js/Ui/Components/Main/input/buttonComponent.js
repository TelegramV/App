import VComponent from "../../../../V/VRDOM/component/VComponent"

export class ButtonWithProgressBarComponent extends VComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }

    render() {
        let classes = ["btn", "rp"]
        if (this.props.disabled) {
            classes.push("disabled")
        }
        if (this.state.isLoading) {
            classes.push("loading")
        }
        return <button className={classes.join(" ")} onClick={this.onClick}>
            <span className="button-text">{this.props.label}</span>
            <progress className="progress-circular white"/>
        </button>
    }

    onClick = (ev) => {
        if (this.props.disabled || this.state.isLoading) return
        this.props.click(ev)
    }

    set isLoading(value) {
        this.state.isLoading = value
        this.forceUpdate()
    }

    set label(label) {
        this.props.label = label
        this.forceUpdate()
    }

    setDisabled = (value = true) => {
        this.props.disabled = value
        this.forceUpdate()
    }
}