import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent";
import MessageTimeComponent from "./common/MessageTimeComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {PhotoComponent} from "../../basic/photoComponent";
import {PhotoMessage} from "../../../../../Api/Messages/Objects/PhotoMessage";
import {VideoMessage} from "../../../../../Api/Messages/Objects/VideoMessage";
import {VideoComponent} from "../../basic/videoComponent";
import type {BusEvent} from "../../../../../Api/EventBus/EventBus";
import {Layouter} from "../../../../Utils/layout";

class GroupedMessageComponent extends GeneralMessageComponent {

    reactive(R) {
        super.reactive(R)

        R.object(this.message)
            .on("updateGrouped", this.onUpdateGrouped)
    }

    render() {
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
        this.forceUpdate()
    }

}

export default GroupedMessageComponent