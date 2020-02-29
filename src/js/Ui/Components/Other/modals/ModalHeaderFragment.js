import VComponent from "../../../../V/VRDOM/component/VComponent"
import VUI from "../../../VUI"

export class ModalHeaderFragment extends VComponent {
    render() {
        return <div className="header">
            {
                this.props.close ? <i className="tgico tgico-close btn-icon" onClick={_ => VUI.Modal.close()}/> : ""
            }
            {this.props.title}
            {
                this.props.actionText ? <div className="modal-action-btn rp rps"
                                             onClick={this.props.action}>{this.props.actionText}</div> : ""
            }
        </div>
    }
}