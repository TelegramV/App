import CardMessageWrapperFragment from "./Common/CardMessageWrapperFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {CallsManager} from "../../../../../Api/Calls/CallManager";
import PeersStore from "../../../../../Api/Store/PeersStore";

class PhoneCallMessageComponent extends GeneralMessageComponent {

    render() {
        const peer = this.props.message.to === PeersStore.self() ? this.props.message.from : this.props.message.to
        let title = ""
        switch (this.props.message.raw.action.reason._) {
            case "phoneCallDiscardReasonMissed":
                title = "Cancelled call"
                break
            case "phoneCallDiscardReasonDisconnect":
            case "phoneCallDiscardReasonHangup":
                title = this.props.message.isOut ? "Outgoing call" : "Incoming call"
                break

            case "phoneCallDiscardReasonBusy":
                title = "Missed call"
                break
        }
        let icon = <i className="tgico tgico-phone" css-font-size="32px"/>
        return (
            <CardMessageWrapperFragment icon={icon} title={title}
                                        description={this.props.message.raw.action.duration + " seconds"}
                                        message={this.props.message}
                                        bubbleRef={this.bubbleRef} onClick={l => CallsManager.startCall(peer)}/>
        )
    }
}

export default PhoneCallMessageComponent