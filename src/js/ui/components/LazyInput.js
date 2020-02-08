import VComponent from "../v/vrdom/component/VComponent"

// райтс https://github.com/HurricaneJames/lazy-input/blob/master/src/LazyInput.jsx

export class LazyInput extends VComponent {

    useProxyState = false

    procrastinating = false

    lazyLevel = this.props.lazyLevel || 1000

    state = {
        value: this.props.value,
        requestedValue: undefined
    }

    h() {
        return (
            <input type={this.props.type || "text"}
                   onInput={this.onInput}
                   onFocus={this.props.onFocus}
                   placeholder={this.props.placeholder}/>
        )
    }

    updateIfNotLazy = (newValue, event) => {
        if (!this.procrastinating) {
            if (this.state.value !== newValue) {
                this.state.value = newValue
                this.state.requestedValue = undefined
                this.props.onInput(event)
            }
        } else {
            this.state.requestedValue = newValue
        }
    }

    procrastinate = (event) => {
        if (event.target.value !== this.state.value) {
            this.procrastinating = true
            this.clearTimeouts()
            this.withTimeout(() => this.ohAlrightAlready(event), this.lazyLevel)
        }
    }

    ohAlrightAlready = (event) => {
        this.procrastinating = false
        this.updateIfNotLazy(this.state.requestedValue, event)
    }

    onInput = (event) => {
        this.procrastinate(event)
        this.state.value = event.target.value
    }
}