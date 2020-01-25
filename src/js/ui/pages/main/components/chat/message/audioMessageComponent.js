import MessageWrapperComponent from "./messageWrapperComponent";
import TextWrapperComponent from "./TextWrapperComponent";

const AudioMessageComponent = ({message}) => {
    let audioSrc = message.media.document.real ? message.media.document.real.url : "";
    return (
        <MessageWrapperComponent message={message}>
            <audio controls src={audioSrc} type={message.media.document.mime_type}/>
            <TextWrapperComponent message={message}/>
        </MessageWrapperComponent>
    )
}

export default AudioMessageComponent