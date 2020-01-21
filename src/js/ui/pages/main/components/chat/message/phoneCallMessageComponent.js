import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"
import MessageWrapperComponent from "./messageWrapperComponent"
import MessageTimeComponent from "./messageTimeComponent"
import TextWrapperComponent from "./textWrapperComponent";
import CardMessageComponent from "./cardMessageComponent";



const PhoneCallMessageComponent = ({ message }) => {
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
    let icon = <i className="tgico tgico-phone" css-font-size="32px"/>
    return (
        <CardMessageComponent icon={icon} title={title} description={message.raw.action.duration + " seconds"} message={message}/>
        // <MessageWrapperComponent message={message}>
        //     <div className="message">
        //         Cancelled call
        //         <i className="tgico tgico-phone"/>
        //     </div>
        // </MessageWrapperComponent>
    )
}

export default PhoneCallMessageComponent