import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import TextWrapperFragment from "./Common/TextWrapperFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent";


class TextMessageComponent extends GeneralMessageComponent {
    render({message, showDate, isNewMessages}) {
        const transparent = message.isBigEmojis;

        return (
            MessageWrapperFragment(
                {message, showDate, transparent, isNewMessages},
                TextWrapperFragment({message, big: transparent, transparent})
            )
        );
    }
}

export default TextMessageComponent;