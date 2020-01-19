import MessageWrapperComponent from "./messageWrapperComponent";
import TextWrapperComponent from "./textWrapperComponent";

const AudioMessageComponent = ({message}) => {
    let audioSrc = message.media.document.real ? message.media.document.real.url : "";
    return (
        <MessageWrapperComponent message={message}>
            <div class="message">
                <audio constrols>
                    <source src={audioSrc} type={message.media.document.mime_type}/>
                </audio>
                <TextWrapperComponent message={message}/>
            </div>
        </MessageWrapperComponent>
    )
}

export default AudioMessageComponent