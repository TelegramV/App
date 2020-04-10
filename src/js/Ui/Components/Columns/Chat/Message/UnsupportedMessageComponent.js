import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"

class UnsupportedMessageComponent extends GeneralMessageComponent {

    render() {
        return (
            <MessageWrapperFragment ref={`msg-${this.message.id}`} message={this.message} bubbleRef={this.bubbleRef}>
                <i>Unsupported Message</i>
            </MessageWrapperFragment>
        )
    }
}

export default UnsupportedMessageComponent