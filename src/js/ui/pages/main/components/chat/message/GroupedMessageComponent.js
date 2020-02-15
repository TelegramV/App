import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent";
import MessageTimeComponent from "./common/MessageTimeComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {PhotoComponent} from "../../basic/photoComponent";
import {PhotoMessage} from "../../../../../../api/messages/objects/PhotoMessage";
import {VideoMessage} from "../../../../../../api/messages/objects/VideoMessage";
import {VideoComponent} from "../../basic/videoComponent";
import type {BusEvent} from "../../../../../../api/eventBus/EventBus";
import {Layouter} from "../../../../../utils/layout";

class GroupedMessageComponent extends GeneralMessageComponent {

    reactive(R) {
        super.reactive(R)

        R.object(this.message)
            .on("updateGrouped", this.onUpdateGrouped)
    }

    h() {
        const text = this.message.text.length > 0 ? <TextWrapperComponent message={this.message}/> : ""

        return (
            <MessageWrapperFragment ref={`msg-${this.message.id}`} message={this.message} noPad showUsername={false}
                                    outerPad={text !== ""} bubbleRef={this.bubbleRef}>
                <div className={["grouped", this.message.group ? Layouter.getClass(this.message.group.length) : ""]}>
                    {this.message.group && this.message.group.map(l => {
                        if (l instanceof PhotoMessage) {
                            return <PhotoComponent photo={l.raw.media.photo}/>
                        } else if (l instanceof VideoMessage) {
                            return <VideoComponent video={l.raw.media.document}/>
                        } else {
                            console.log(l)
                            debugger;
                        }
                    })}
                </div>
                {!text ? <MessageTimeComponent message={this.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }

    onUpdateGrouped = (event: BusEvent) => {
        console.log("update grouped!!!", this.message.group)
        this.__patch()
    }

}

export default GroupedMessageComponent