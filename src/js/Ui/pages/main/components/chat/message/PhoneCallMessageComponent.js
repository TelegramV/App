import CardMessageWrapperFragment from "./common/CardMessageWrapperFragment";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {CallsManager} from "../../../../../../Api/Calls/CallManager";
import PeersStore from "../../../../../../Api/Store/PeersStore";

class PhoneCallMessageComponent extends GeneralMessageComponent {

    h() {
        const peer = this.message.to === PeersStore.self() ? this.message.from : this.message.to
        let title = ""
        switch (this.message.raw.action.reason._) {
            case "phoneCallDiscardReasonMissed":
                title = "Cancelled call"
                break
            case "phoneCallDiscardReasonDisconnect":
            case "phoneCallDiscardReasonHangup":
                title = this.message.isOut ? "Outgoing call" : "Incoming call"
                break

            case "phoneCallDiscardReasonBusy":
                title = "Missed call"
                break
        }
        let icon = <i className="tgico tgico-phone" css-font-size="32px"/>
        return (
            <CardMessageWrapperFragment icon={icon} title={title}
                                        description={this.message.raw.action.duration + " seconds"}
                                        message={this.message}
                                        bubbleRef={this.bubbleRef} onClick={l => CallsManager.startCall(peer)}/>
        )
    }
}

export default PhoneCallMessageComponent