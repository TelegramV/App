import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {PhotoComponent} from "../../basic/photoComponent";
import {PhotoMessage} from "../../../../../../api/messages/objects/PhotoMessage";
import {VideoMessage} from "../../../../../../api/messages/objects/VideoMessage";
import {VideoComponent} from "../../basic/videoComponent";
import type {BusEvent} from "../../../../../../api/eventBus/EventBus";

class GroupedMessageComponent extends GeneralMessageComponent {

    init() {
        super.init()
        this.reactive = {
            message: this.message
        }
    }

    h() {
        return (
            <MessageWrapperFragment ref={`msg-${this.message.id}`} message={this.message} showAvatar={this.showAvatar}>
                {this.message.group && this.message.group.map(l => {
                    if(l instanceof PhotoMessage) {
                        return <PhotoComponent photo={l.raw.media.photo}/>
                    } else if(l instanceof VideoMessage) {
                        return <VideoComponent video={l.raw.media.document}/>
                    } else {
                        console.log(l)
                        debugger;
                    }
                })}
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperFragment>
        )
    }



    reactiveChanged(key: string, value: any, event: BusEvent) {
        super.reactiveChanged(key, value, event)
        console.log("reactiveChanged", key, value, event)
        if (key === "message") {
            if (event.type === "updateGrouped") {
                console.log("updateGrouped!", this.message.groupInitializer)
                this.__patch()
            }
        }
    }

}

export default GroupedMessageComponent