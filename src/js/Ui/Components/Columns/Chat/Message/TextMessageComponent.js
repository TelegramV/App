import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import TextWrapperComponent from "./Common/TextWrapperComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent";


class TextMessageComponent extends GeneralMessageComponent {
    render({message, showDate, isNewMessages}) {
        const transparent = message.isBigEmojis;

        return (
            MessageWrapperFragment(
                {message, showDate, transparent, isNewMessages},
                <>
                    <TextWrapperComponent message={message} big={transparent} transparent={transparent}/>
                </>
            )
        );
    }
}

export default TextMessageComponent;