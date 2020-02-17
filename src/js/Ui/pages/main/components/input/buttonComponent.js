import Component from "../../../../../V/VRDOM/Component";

export class ButtonWithProgressBarComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }

    h() {
        let classes = ["btn", "rp"]
        if (this.props.disabled) {
            classes.push("disabled")
        }
        if(this.state.isLoading) {
            classes.push("loading")
        }
        return <button className={classes.join(" ")} onClick={this.onClick}>
            <span className="button-text">{this.props.label}</span>
            <progress className="progress-circular white"/>
        </button>
    }

    onClick(ev) {
        if(this.props.disabled || this.state.isLoading) return
        this.props.click(ev)
    }

    set isLoading(value) {
        this.state.isLoading = value
        this.__patch()
    }

    set label(label) {
        this.props.label = label
        this.__patch()
    }

    setDisabled(value = true) {
        this.props.disabled = value
        this.__patch()
    }
}