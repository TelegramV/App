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
        return (
            <div className="dropdown-container">
                <div className="input-field dropdown down">
                    <input type="text" id={this.props.name} autocomplete="pls,no" placeholder={this.props.label} onBlur={this.onBlur}
                           onFocus={this.onFocus} onInput={this.onInput} value={this.state.value}/>
                    <label htmlFor={this.props.name} required>{this.props.label}</label>
                    <i className="arrow btn-icon rp rps tgico tgico-down" onMouseDown={this.onClick}/>
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
        this.state.value = this.props.data[i].name
        this.inputField.value = this.state.value
        this.setOpened(false);
    }

    select(i) {
        this.state.value = this.props.data[i].name
        this.inputField.value = this.state.value
    }

    mounted() {
        super.mounted();
        this.inputField = this.$el.querySelector("input");
        this.arrowEl = this.$el.querySelector(".arrow")

        let nodes = Array.from(this.$el.querySelector(".dropdown-list").childNodes);
        for (let i in nodes) {
            const node = nodes[i]

            node.onmousedown = function (ev) {
                // TODO filterby property
                this.selected(i)
            }.bind(this)
        }
    }

    setOpened(val) {
        this.state.opened = !!val;
        this.patchDropdown();
        this.patchInput();
    }

    patchDropdown() {
        const current = this.inputField.value.toLowerCase()

        let nodes = Array.from(this.$el.querySelector(".dropdown-list").childNodes);
        let visibleCount = 0;
        for (let i in nodes) {
            const node = nodes[i]

            if(!this._countryTest(current, this.props.data[i].name)) {
                node.classList.add("hidden")
            } else {
                node.classList.remove("hidden")
                visibleCount++;
            }
        }

        let list = this.$el.querySelector(".dropdown-list");
        if(visibleCount==0 || !this.state.opened) {
            list.classList.add("hidden")
        } else if(this.state.opened){
            list.classList.remove("hidden")
        }
    }

    patchInput() {
        if(this.state.opened) {
            this.arrowEl.classList.remove("tgico-down");
            this.arrowEl.classList.add("tgico-up");
        } else {
            this.arrowEl.classList.add("tgico-down");
            this.arrowEl.classList.remove("tgico-up");
        }
    }

    _countryTest(input, country) {
        if(country.toLowerCase().includes(input.toLowerCase())) return true;
        let split = country.split(/\b(?=[a-z])/ig);
        if(split.length > 1) {
            let abbr = split.map(token => token[0]).join("").toLowerCase();
            if(abbr.includes(input.toLowerCase())) return true;
        }
    }


    onInput() {
        this.setOpened(true)
    }

    onClick(ev) {
        this.setOpened(!this.state.opened)

        ev.preventDefault()
        if (this.state.opened) {
            this.inputField.focus()
        } else {
            this.inputField.blur()
        }
    }

    onBlur(ev) {
        if (!this.state.opened) return

        this.setOpened(false)
    }

    onFocus(ev) {
        if (this.state.opened) return

        this.setOpened(true)
    }
}