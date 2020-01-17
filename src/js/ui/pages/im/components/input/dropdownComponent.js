export const DropdownComponent = {
    name: "dropdown-component",
    state: {
        selected: null,
        opened: false
    },
    h({id, label}) {
        let arrowClasses = ["arrow", "btn-icon", "rp", "rps", "tgico"]
        console.log("Current open status", this.state.opened)
        arrowClasses.push(this.state.opened ? "tgico-up" : "tgico-down")
        return (
            <div className="dropdown-container" id={id} onClick={this.onClick.bind(this)}>
                <div className="input-field dropdown down">
                    <input type="text" autoComplete="nah" placeholder={label}/>
                    <label htmlFor="country" required>{label}{this.state.opened}</label>
                    <i className={arrowClasses.join(" ")}/>
                </div>
                <div className="dropdown-list hidden"/>
            </div>
        )
    },
    onClick(ev) {
        this.state.opened = !this.state.opened
        VDOM.patchReal(this.$el, this.h(this.props))
    }
}