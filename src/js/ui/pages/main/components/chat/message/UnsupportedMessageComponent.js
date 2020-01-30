import MessageWrapperFragment from "./common/MessageWrapperFragment"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class UnsupportedMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperFragment ref={`msg-${this.message.id}`} message={this.message}>
                <i>Unsupported Message</i>
            </MessageWrapperFragment>
        )
    }
}

export default UnsupportedMessageComponent