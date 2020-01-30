import Component from "../../../../v/vrdom/Component";

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

        return (
            <div className="dropdown-container">
                <div className="input-field dropdown down">
                    <input type="text" id={this.props.name} autocomplete="pls,no" placeholder={this.props.label} onBlur={this.onBlur}
                           onFocus={this.onFocus} onInput={this.onInput} value={this.state.value}/>
                    <label htmlFor={this.props.name} required>{this.props.label}</label>
                    <i className={arrowClasses.join(" ")} onMouseDown={this.onClick}/>
                </div>
                <div className="dropdown-list hidden">
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
        this.inputField.value = this.state.value
    }

    mounted() {
        super.mounted();
        this.inputField = this.$el.querySelector("input");

        this.props.nodes = Array.from(this.$el.querySelector(".dropdown-list").childNodes)
        for (let i in this.props.nodes) {
            const node = this.props.nodes[i]

            node.onmousedown = function (ev) {
                // TODO filterby property
                this.state.value = this.props.data[i].name
                this.selected(i)
                this.__patch()
                this.inputField.value = this.state.value
            }.bind(this)
        }
    }

    patchDropdown() {
        const current = this.inputField.value.toLowerCase()

        let visibleCount = 0;
        for (let i in this.props.nodes) {
            const node = this.props.nodes[i]

            if(!this.countryTest(current, this.props.data[i].name)) {
                node.classList.add("hidden")
            } else {
                node.classList.remove("hidden")
                visibleCount++;
            }
        }
        let list = this.$el.querySelector(".dropdown-list");
        if(visibleCount==0) {
            list.classList.add("hidden")
        } else if(this.state.opened){
            list.classList.remove("hidden")
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


    onInput() {
        this.patchDropdown()
    }

    onClick(ev) {
        this.state.opened = !this.state.opened

        this.__patch()

        ev.preventDefault()
        if (this.state.opened) {
            this.inputField.focus()
        } else {
            this.inputField.blur()
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

    __patch() {
        super.__patch();
        this.patchDropdown()
    }

}