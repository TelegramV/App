import VComponent from "../../V/VRDOM/component/VComponent"

export let ModalManager

export class ModalComponent extends VComponent {
    constructor(props) {
        super(props)
        ModalManager = this
        this.state = {
            hidden: true,
        }
    }

    // TODO fix loginscreen modal

    render() {
        return (
            <div className={["modal-wrapper", this.state.hidden ? "hidden" : ""]}>
                <div className="modal" onClick={this.close}>
                    <div className="dialog" onClick={l => l.stopPropagation()}>
                        {this.state.body}
                    </div>
                </div>
            </div>
        )
    }

    close = () => {
        this.state.hidden = true
        this.state.body = ""
        this.forceUpdate()
    }

    open = (body) => {
        this.state.hidden = false
        this.state.body = body
        this.forceUpdate()
    }
}