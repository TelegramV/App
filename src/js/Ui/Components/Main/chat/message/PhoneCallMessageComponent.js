import CardMessageWrapperFragment from "./common/CardMessageWrapperFragment";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class PhoneCallMessageComponent extends GeneralMessageComponent {

    render() {
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
                                        bubbleRef={this.bubbleRef}/>
        )
    }
}

export default PhoneCallMessageComponent