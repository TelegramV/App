import MessageWrapperComponent from "./messageWrapperComponent";
import MessageTimeComponent from "./messageTimeComponent";

const RoundVideoMessageComponent = ({message}) => {
    let videoSrc = message.media.document.real ? message.media.document.real.url : "";
    return (
        <MessageWrapperComponent message={message} transparent={true}>
            <div className="round-video-wrapper">
                <video controls src={videoSrc} type={message.media.document.mime_type}/>
            </div>
            <MessageTimeComponent message={message} bg={true}/>
        </MessageWrapperComponent>
    )
}

export default RoundVideoMessageComponent