import {InputComponent} from "../input/inputComponent";
import {ModalHeaderFragment} from "./ModalHeaderFragment";
import {ModalManager} from "../../../Fuck/modalManager";
import VComponent from "../../../../V/VRDOM/component/VComponent"

export class AttachLinkModal extends VComponent {
    render() {
        return <div className="attach-modal">
            <ModalHeaderFragment title="Create link" close actionText="Create" action={this.create}/>
            <div className="padded bottom">
                <InputComponent ref="createLinkText" label="Text" value={this.props.text || ""}/>
                <InputComponent ref="createLinkUrl" label="URL"/>
            </div>
        </div>
    }

    create() {
        const text = this.refs.get("createLinkText").getValue()
        const url = this.refs.get("createLinkUrl").getValue()
        this.props.close(text, url)
        ModalManager.close()
    }
}