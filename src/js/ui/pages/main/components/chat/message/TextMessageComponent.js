import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class TextMessageComponent extends GeneralMessageComponent {

    h() {
        const username = this.message.from.name && !this.message.isPost && !this.message.isOut

        return (
            <MessageWrapperFragment ref={`msg-${this.message.id}`} message={this.message}>
                {username ? <div className="username">{this.message.from.name}</div> : ""}
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperFragment>
        )
    }
}

export default TextMessageComponent