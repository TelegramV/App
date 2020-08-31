import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent";

class UnsupportedMessageComponent extends GeneralMessageComponent {

    render({message, showDate}) {
        return (
            MessageWrapperFragment(
                {message, showDate},
                <>
                    <i>Unsupported Message</i>
                </>
            )
        );
    }
}

export default UnsupportedMessageComponent;