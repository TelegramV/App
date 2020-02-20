import VComponent from "../../../../V/VRDOM/component/VComponent"

export class InputComponent extends VComponent {

    inputRef = VComponent.createRef()

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value
        }
    }

    render() {
        let classes = ["input-field"]
        if (this.props.type === "password") {
            classes.push("peekable")
            classes.push("password-input")
        }
        let peekClasses = ["btn-icon", "rp", "rps", "tgico"]
        if (!this.props.hide) {
            peekClasses.push("peek")
        }
        return (
            <div className={classes.join(" ")}>
                {
                    this.props.type === "password" ?
                        <i id="peekButton" className={peekClasses.join(" ")} onClick={this.peek}/>
                        : ""
                }
                <input onKeyDown={this.onKeyDown}
                       type={this.props.type === "password" && !this.props.hide ? "text" : this.props.type}
                       autocomplete="pls,no" placeholder={this.props.error || this.props.label}
                       value={this.props.error || this.props.value || ""}
                       onInput={l => this.onInput(l, this.props.filter, this.props.input)}
                       ref={this.inputRef}
                       className={this.props.error ? "invalid" : ""}/>
                <label>{this.props.error || this.props.label}</label>
            </div>
        )
    }

    set error(error) {
        this.props.error = error
        this.forceUpdate()
    }

    get error() {
        return this.props.error
    }

    onKeyDown = (ev) => {
        if ((ev.which === 13 || ev.which === 10) && !ev.shiftKey && !ev.ctrlKey) {
            ev.preventDefault()
            this.onInput(ev, this.props.filter, this.props.input)
        }
    }

    onInput = (ev, filter, input) => {
        const target = ev.target
        if (filter) {
            const previousValue = target.previousValue || ""
            const previousSelectionStart = target.previousSelectionStart || 0
            const previousSelectionEnd = target.previousSelectionEnd || 0

            if (!filter(target.value) || (input && !input(ev))) {
                target.value = previousValue
                target.setSelectionRange(previousSelectionStart, previousSelectionEnd)
            } else {
                if (this.error) {
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
                if (this.error) {
                    this.error = undefined
                }
            }
            this.state.value = target.value

            target.previousValue = target.value
            target.previousSelectionStart = target.selectionStart
            target.previousSelectionEnd = target.selectionEnd
        }
    }

    peek = () => {
        this.props.hide = !this.props.hide
        if (this.props.peekChange) {
            this.props.peekChange(this.props.hide)
        }
        this.forceUpdate()
    }

    getValue = () => {
        return this.state.value
    }

    setValue = (value) => {
        this.props.value = value
        this.forceUpdate()
        this.$el.querySelector("input").value = value
    }
}