import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"

class UnsupportedMessageComponent extends GeneralMessageComponent {

    render() {
        return (
            <MessageWrapperFragment ref={`msg-${this.props.message.id}`} message={this.props.message} bubbleRef={this.bubbleRef}>
                <i>Unsupported Message</i>
            </MessageWrapperFragment>
        )
    }
}

export default UnsupportedMessageComponent