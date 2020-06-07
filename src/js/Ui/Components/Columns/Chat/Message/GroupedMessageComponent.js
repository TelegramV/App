import {PhotoMessage} from "../../../../../Api/Messages/Objects/PhotoMessage";
import {VideoMessage} from "../../../../../Api/Messages/Objects/VideoMessage";
import {Layouter} from "../../../../Utils/layout";
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"
import BetterPhotoComponent from "../../../Basic/BetterPhotoComponent"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import TextWrapperComponent from "./Common/TextWrapperComponent"
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import UIEvents from "../../../../EventBus/UIEvents"

class GroupedMessageComponent extends GeneralMessageComponent {

    reactive(R) {
        super.reactive(R);

        R.object(this.props.message)
            .updateOn("groupUpdated")
    }

    render({message: group}) {
        const text = group.text.length > 0 ? <TextWrapperComponent message={group}/> : ""

        return (
            <MessageWrapperFragment message={group}
                                    noPad
                                    showUsername={false}
                                    outerPad={text !== ""}
                                    bubbleRef={this.bubbleRef}>
                <div className={["grouped", Layouter.getClass(group.messages.size)]}>
                    {
                        Array.from(group.messages).reverse().map(message => {
                            if (message instanceof PhotoMessage) {
                                return <BetterPhotoComponent photo={message.raw.media.photo}
                                                             onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: message})}
                                                             calculateSize/>
                            } else if (message instanceof VideoMessage) {
                                return <BetterVideoComponent document={message.raw.media.document}
                                                             onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: message})}
                                                             calculateSize/>
                            } else {
                                console.error(message)
                                return null;
                            }
                        })
                    }
                </div>
                {!text ? <MessageTimeComponent message={group} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }
}

export default GroupedMessageComponent