import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class TextMessageComponent extends GeneralMessageComponent {

    render() {
        return (
            <MessageWrapperFragment ref={`msg-${this.message.id}`} message={this.message} avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperFragment>
        )
    }
}

export default TextMessageComponent