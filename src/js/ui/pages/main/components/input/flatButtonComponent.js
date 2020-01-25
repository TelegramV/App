import Component from "../../../../v/vrdom/component";

export class FlatButtonComponent extends Component {
    constructor(props) {
        super(props)
    }

    h() {
        let classes = ["btn-flat", "rp"]
        if (this.props.disabled) {
            classes.push("disabled")
        }
        if (this.props.red) {
            classes.push("red")
        }
        return <button className={classes} onClick={this.onClick}>
            <span className="button-text">{this.props.label}</span>
        </button>
    }

    onClick(ev) {
        if(this.props.disabled) return
        this.props.click(ev)
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