import MessageWrapperFragment from "./common/MessageWrapperFragment"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class UnsupportedMessageComponent extends GeneralMessageComponent {

    h() {
        const username = this.message.from.name && !this.message.isPost && !this.message.isOut

        return (
            <MessageWrapperFragment ref={`msg-${this.message.id}`} message={this.message}>
                {username ? <div className="username">{this.message.from.name}</div> : ""}
                <i>Unsupported Message</i>
            </MessageWrapperFragment>
        )
    }
}

export default UnsupportedMessageComponent