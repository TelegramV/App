import CardMessageWrapperFragment from "./Common/CardMessageWrapperFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {CallsManager} from "../../../../../Api/Calls/CallManager";
import PeersStore from "../../../../../Api/Store/PeersStore";

class PhoneCallMessageComponent extends GeneralMessageComponent {
    render({message, showDate}) {
        const peer = message.to === PeersStore.self() ? message.from : message.to

        let title = ""

        switch (message.raw.action.reason._) {
            case "phoneCallDiscardReasonMissed":
                title = "Cancelled call"
                break
            case "phoneCallDiscardReasonDisconnect":
            case "phoneCallDiscardReasonHangup":
                title = message.isOut ? "Outgoing call" : "Incoming call"
                break

            case "phoneCallDiscardReasonBusy":
                title = "Missed call"
                break
        }

        let icon = <i style={{
            color: message.raw.action.reason && message.raw.action.reason._ !== "phoneCallDiscardReasonHangup" && !message.raw.action.duration && "red"
        }} className="tgico tgico-phone" css-font-size="32px"/>

        let time = message.raw.action.duration
        let timeString = time + " seconds"
        if(!time) {
            timeString = ""
        }
        if(time >= 60) {
            timeString = Math.floor(time / 60) + " min"
            if(time % 60 !== 0) {
                timeString += " " + (time - Math.floor(time / 60) * 60) + " s"
            }
        }
        return (
            <CardMessageWrapperFragment icon={icon} title={title}
                                        description={timeString}
                                        message={message}
                                        onClick={() => CallsManager.startCall(peer)}
                                        showDate={showDate}/>
        )
    }
}

export default PhoneCallMessageComponent