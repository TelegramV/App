import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import TextWrapperComponent from "./Common/TextWrapperComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"

class TextMessageComponent extends GeneralMessageComponent {

    render() {
        return (
            <MessageWrapperFragment message={this.message} avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperFragment>
        )
    }
}

export default TextMessageComponent