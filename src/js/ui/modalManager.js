import Component from "./v/vrdom/component";

export let ModalManager

export class ModalComponent extends Component {
    constructor(props) {
        super(props)
        ModalManager = this
        this.state = {
            hidden: true,
        }
    }

    h() {
        return (
            <div className={["modal-wrapper", this.state.hidden ? "hidden" : ""]}>
                <div className="modal" onClick={this.close}>
                    <div className="dialog" onClick={l => l.stopPropagation()}>
                        <div className="content">
                            <div className="header">
                                {/*<i className="btn-icon rp rps tgico tgico-close close-button" onClick={this.close}/>*/}
                                <div className="title">{this.state.title}</div>
                            </div>
                            <div className="body">
                                {this.state.body}
                                {/*<div id="photoDone" className="done-button rp"><i className="tgico tgico-check"/></div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    close() {
        this.state.hidden = true
        this.__patch()
    }

    open(title, body) {
        this.state.hidden = false
        this.state.title = title
        this.state.body = body
        this.__patch()
    }
}