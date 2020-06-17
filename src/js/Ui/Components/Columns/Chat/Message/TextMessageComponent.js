import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import TextWrapperComponent from "./Common/TextWrapperComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"

class TextMessageComponent extends GeneralMessageComponent {
    render({message, showDate}) {
        return (
            <MessageWrapperFragment message={this.props.message} avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}
                                    showDate={showDate}>
                <TextWrapperComponent message={this.props.message}/>
            </MessageWrapperFragment>
        )
    }
}

export default TextMessageComponent