import Component from "../../../../v/vrdom/component";

export class DropdownComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            opened: false
        }
    }

    h() {
        let arrowClasses = ["arrow", "btn-icon", "rp", "rps", "tgico"]
        arrowClasses.push(this.state.opened ? "tgico-up" : "tgico-down")
        let dropdownClasses = ["dropdown-list"]
        if (!this.state.opened) {
            dropdownClasses.push("hidden")
        }
        return (
            <div className="dropdown-container">
                <div className="input-field dropdown down">
                    <input type="text" id={this.props.name} autocomplete="pls,no" placeholder={this.props.label} onBlur={this.onBlur}
                           onFocus={this.onFocus} onInput={this.onInput} value={this.state.value}/>
                    <label htmlFor={this.props.name} required>{this.props.label}</label>
                    <i className={arrowClasses.join(" ")} onMouseDown={this.onClick}/>
                </div>
                <div className={dropdownClasses.join(" ")}>
                    {
                        this.props.data.map(this.props.template)
                    }
                </div>
            </div>
        )
    }

    selected(i) {
        this.props.selected(this.props.data[i])
    }

    select(i) {
        this.state.value = this.props.data[i].name
        this.__patch()
        this.$el.querySelector("input").value = this.state.value
    }

    mounted() {
        super.mounted();

        this.props.nodes = Array.from(this.$el.querySelector(".dropdown-list").childNodes)
        for (let i in this.props.nodes) {
            const node = this.props.nodes[i]

            node.onmousedown = function (ev) {
                // TODO filterby property
                this.state.value = this.props.data[i].name
                this.selected(i)
                this.__patch()
                this.$el.querySelector("input").value = this.state.value
            }.bind(this)
        }
    }

    patchDropdown() {
        const current = this.$el.querySelector("input").value.toLowerCase()
        for (let i in this.props.nodes) {
            const node = this.props.nodes[i]

            // TODO create other check functions as well
            if(!this.countryTest(current, this.props.data[i].name)) {
            //if(!this.props.data[i].name.toLowerCase().includes(current)) {
                node.classList.add("hidden")
            } else {
                node.classList.remove("hidden")
            }
            //this.__patch()
        }
    }

    countryTest(input, country) {
        if(country.toLowerCase().includes(input.toLowerCase())) return true;
        let split = country.split(/\b(?=[a-z])/ig);
        if(split.length > 1) {
            let abbr = split.map(token => token[0]).join("").toLowerCase();
            if(abbr.includes(input.toLowerCase())) return true;
        }
    }


    onInput(ev) {
        const current = ev.target.value
        this.patchDropdown()
    }

    onClick(ev) {
        this.state.opened = !this.state.opened

        this.__patch()

        ev.preventDefault()
        if (this.state.opened) {
            this.$el.querySelector("input").focus()
        } else {
            this.$el.querySelector("input").blur()
        }
    }

    onBlur(ev) {
        if (!this.state.opened) return

        this.state.opened = false
        this.__patch()
    }

    onFocus(ev) {
        if (this.state.opened) return

        this.state.opened = true
        this.__patch()
    }

}