import MessageWrapperFragment from "./common/MessageWrapperFragment"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

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