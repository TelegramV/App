import MessageWrapperComponent from "./common/MessageWrapperComponent";
import MessageTimeComponent from "./common/MessageTimeComponent";
import {VideoComponent} from "../../basic/videoComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class RoundVideoMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperComponent message={this.message} transparent={true} noPad>
                <VideoComponent video={this.message.raw.media.document} round/>
                <MessageTimeComponent message={this.message} bg={true}/>
            </MessageWrapperComponent>
        )
    }
}

export default RoundVideoMessageComponent