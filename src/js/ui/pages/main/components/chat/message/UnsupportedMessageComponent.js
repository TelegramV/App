import MessageWrapperComponent from "./common/MessageWrapperComponent"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class UnsupportedMessageComponent extends GeneralMessageComponent {

    h() {
        const username = this.message.from.name && !this.message.isPost && !this.message.isOut

        return (
            <MessageWrapperComponent ref={`msg-${this.message.id}`} message={this.message}>
                {username ? <div className="username">{this.message.from.name}</div> : ""}
                <i>Unsupported Message</i>
            </MessageWrapperComponent>
        )
    }
}

export default UnsupportedMessageComponent