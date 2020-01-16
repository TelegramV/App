export const InputComponent = {
    name: "input-component",
    h({type = "text", id, label, value = "", filter, input}) {
        let classes = ["input-field"]
        if (type === "password") {
            classes.push("peekable")
            classes.push("password-input")
        }
        return (
            <div className={classes.join(" ")}>
                {
                    type === "password" ?
                        <i id="peekButton" className="btn-icon rp rps tgico"/>
                        : ""
                }
                <input type={type} id={id} autoComplete="nah" placeholder={label} value={value} onInput={l => this.onInput(l, filter, input)}/>
                <label htmlFor={id} required>{label}</label>
            </div>
        )
    },
    onInput(ev, filter, input) {
        const target = ev.target
        if(filter) {
            const previousValue = target.previousValue || ""
            const previousSelectionStart = target.previousSelectionStart || 0
            const previousSelectionEnd = target.previousSelectionEnd || 0

            if(!filter(target.value) || (input && !input(ev))) {
                target.value = previousValue
                target.setSelectionRange(previousSelectionStart, previousSelectionEnd)
            }

            target.previousValue = target.value
            target.previousSelectionStart = target.selectionStart
            target.previousSelectionEnd = target.selectionEnd
        }
    }
}