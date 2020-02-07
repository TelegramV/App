import Component from "./v/vrdom/Component";

export let ModalManager

export class ModalComponent extends Component {
    constructor(props) {
        super(props)
        ModalManager = this
        this.state = {
            hidden: true,
        }
    }
    // TODO fix loginscreen modal

    h() {
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

    close() {
        this.state.hidden = true
        this.state.body = ""
        this.__patch()
    }

    open(body) {
        this.state.hidden = false
        this.state.body = body
        this.__patch()
    }
}