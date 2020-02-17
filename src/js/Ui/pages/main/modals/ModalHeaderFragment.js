import Component from "../../../../V/VRDOM/Component";
import {ModalManager} from "../../../modalManager";

export class ModalHeaderFragment extends Component {
    h() {
        return <div className="header">
            {
                this.props.close ? <i className="tgico tgico-close btn-icon" onClick={_ => ModalManager.close()}/> : ""
            }
            {this.props.title}
            {
                this.props.actionText ? <div className="modal-action-btn rp rps" onClick={this.props.action}>{this.props.actionText}</div> : ""
            }
        </div>
    }
}