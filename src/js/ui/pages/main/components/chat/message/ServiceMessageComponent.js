import L from "../../../../../../common/locale/localization"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class ServiceMessageComponent extends GeneralMessageComponent {

    h() {
        let msg = textByAction(this.message);
        return (
            <div className="service">
                <div className="service-msg">{msg}</div>
            </div>
        )
    }

    messageOnReplyFound = () => {
        //
    }

    messageOnReplyNotFound = () => {
        //
    }

    messageOnEdit = () => {
        // what?
    }

    messageOnForwardedFound = () => {
        //
    }
}

function textByAction(message) {
    let action = message.raw.action;
    let msg = action._;
    if (msg == "messageActionPinMessage") {
        /*
            TODO: get replied message, test for media or text, select needed data
        */
        let user = message.from.name;
        let text = "TODO"
        return L("lng_action_pinned_message", {from: user, text: text})
    }
    return msg || "unsupported";
}

export default ServiceMessageComponent