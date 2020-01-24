import Component from "../../../../framework/vrdom/component";

export class InputComponent extends Component {
    constructor(props) {
        super(props)
    }

    h() {
        let classes = ["input-field"]
        if (this.props.type === "password") {
            classes.push("peekable")
            classes.push("password-input")
        }
        return (
            <div className={classes.join(" ")}>
                {
                    this.props.type === "password" ?
                        <i id="peekButton" className="btn-icon rp rps tgico" onClick={this.peek}/>
                        : ""
                }
                <input type={this.props.type === "password" && !this.props.hide ? "text" : this.props.type}
                       autoComplete="nah" placeholder={this.props.error || this.props.label}
                       value={this.props.error || this.props.value || ""}
                       onInput={l => this.onInput(l, this.props.filter, this.props.input)} className={this.props.error ? "invalid" : ""}/>
                <label>{this.props.error || this.props.label}</label>
            </div>
        )
    }

    set error(error) {
        this.props.error = error
        this.__patch()
    }

    get error() {
        return this.props.error
    }

    onInput(ev, filter, input) {
        const target = ev.target
        if (filter) {
            const previousValue = target.previousValue || ""
            const previousSelectionStart = target.previousSelectionStart || 0
            const previousSelectionEnd = target.previousSelectionEnd || 0

            if (!filter(target.value) || (input && !input(ev))) {
                target.value = previousValue
                target.setSelectionRange(previousSelectionStart, previousSelectionEnd)
            } else {
                if(this.error) {
                    this.error = undefined
                }
            }
            this.state.value = target.value

            target.previousValue = target.value
            target.previousSelectionStart = target.selectionStart
            target.previousSelectionEnd = target.selectionEnd
        } else {
            const previousValue = target.previousValue || ""
            const previousSelectionStart = target.previousSelectionStart || 0
            const previousSelectionEnd = target.previousSelectionEnd || 0

            if (input && !input(ev)) {
                target.value = previousValue
                target.setSelectionRange(previousSelectionStart, previousSelectionEnd)
            } else {
                if(this.error) {
                    this.error = undefined
                }
            }
            this.state.value = target.value

            target.previousValue = target.value
            target.previousSelectionStart = target.selectionStart
            target.previousSelectionEnd = target.selectionEnd
        }
    }

    peek() {
        this.props.hide = !this.props.hide
        if(this.props.peekChange) {
            this.props.peekChange(this.props.hide)
        }
        this.__patch()
    }

    getValue() {
        return this.state.value
    }

    setValue(value) {
        this.props.value = value
        this.__patch()
        this.$el.querySelector("input").value = value
    }
}