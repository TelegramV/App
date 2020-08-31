import {PhotoMessage} from "../../../../../Api/Messages/Objects/PhotoMessage";
import {VideoMessage} from "../../../../../Api/Messages/Objects/VideoMessage";
import {Layouter} from "../../../../Utils/layout";
import BetterVideoComponent from "../../../Basic/BetterVideoComponent";
import BetterPhotoComponent from "../../../Basic/BetterPhotoComponent";
import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import TextWrapperFragment from "./Common/TextWrapperFragment";
import MessageTimeFragment from "./Common/MessageTimeFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent";
import UIEvents from "../../../../EventBus/UIEvents";

class GroupedMessageComponent extends GeneralMessageComponent {

    reactive(R) {
        super.reactive(R);

        R.object(this.props.message)
            .updateOn("groupUpdated");
    }

    render({message: group, showDate}) {
        const isText = group.text.length > 0;

        return (
            MessageWrapperFragment(
                {message: group, showDate, outerPad: false},
                <>
                    <div className={["grouped", Layouter.getClass(group.messages.size)]}>
                        {
                            Array.from(group.messages).reverse().map(message => {
                                if (message instanceof PhotoMessage) {
                                    return <BetterPhotoComponent photo={message.raw.media.photo}
                                                                 onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: message})}
                                                                 calculateSize/>;
                                } else if (message instanceof VideoMessage) {
                                    return <BetterVideoComponent document={message.raw.media.document}
                                                                 onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: message})}
                                                                 calculateSize/>;
                                } else {
                                    console.error(message);
                                    return null;
                                }
                            })
                        }
                    </div>
                    {isText ? TextWrapperFragment({message: group}) :
                        MessageTimeFragment({message: group, bg: true})}
                </>
            )
        );
    }
}

export default GroupedMessageComponent;