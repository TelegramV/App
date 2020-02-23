import GeneralMessageComponent from "./common/GeneralMessageComponent"

class ServiceMessageComponent extends GeneralMessageComponent {

    render() {
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
    return message.text
}

export default ServiceMessageComponent