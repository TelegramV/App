import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class TextMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperFragment ref={`msg-${this.message.id}`} message={this.message} showAvatar={this.showAvatar}>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperFragment>
        )
    }
}

export default TextMessageComponent