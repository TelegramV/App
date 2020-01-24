import MessageWrapperComponent from "./messageWrapperComponent";
import MessageTimeComponent from "./messageTimeComponent";
import {VideoComponent} from "../../basic/videoComponent";

const RoundVideoMessageComponent = ({message}) => {
    return (
        <MessageWrapperComponent message={message} transparent={true} noPad>
                <VideoComponent video={message.media.document} round/>
                <MessageTimeComponent message={message} bg={true}/>
        </MessageWrapperComponent>
    )
}

export default RoundVideoMessageComponent