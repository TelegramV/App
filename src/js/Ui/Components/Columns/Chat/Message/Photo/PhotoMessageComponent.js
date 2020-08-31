import MessageWrapperFragment from "../Common/MessageWrapperFragment";
import TextWrapperFragment from "../Common/TextWrapperFragment";
import MessageTimeFragment from "../Common/MessageTimeFragment";
import GeneralMessageComponent from "../Common/GeneralMessageComponent";
import UIEvents from "../../../../../EventBus/UIEvents";
import BetterPhotoComponent from "../../../../Basic/BetterPhotoComponent";

class PhotoMessageComponent extends GeneralMessageComponent {
    render({message, showDate}) {
        const text = this.props.message.text.length > 0 ? TextWrapperFragment({message}) : "";

        return (
            MessageWrapperFragment(
                {message, showDate, showUsername: false, outerPad: text !== ""},
                <>
                    <BetterPhotoComponent calculateSize={true}
                                          photo={this.props.message.raw.media.photo}
                                          maxWidth={this.props.message.text.length === 0 ? 480 : 470}
                                          maxHeight={512}
                                          onClick={this.openMediaViewer}/>

                    {!text && MessageTimeFragment({message, bg: true})}

                    {text}
                </>
            )
        );
    }

    openMediaViewer = () => {
        UIEvents.MediaViewer.fire("showMessage", {message: this.props.message});
    };
}

export default PhotoMessageComponent;