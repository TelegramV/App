import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import TextWrapperComponent from "./Common/TextWrapperComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"


class TextMessageComponent extends GeneralMessageComponent {
    render({message, showDate, isNewMessages}) {
    	const transparent = message.isBigEmojis
        return (
            <MessageWrapperFragment message={this.props.message} avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}
                                    showDate={showDate}
                                    transparent={transparent}
                                    isNewMessages={isNewMessages}>
                <TextWrapperComponent message={this.props.message} big={transparent} transparent={transparent}/>
            </MessageWrapperFragment>
        )
    }
}

export default TextMessageComponent