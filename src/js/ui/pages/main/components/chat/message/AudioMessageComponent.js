import MessageWrapperComponent from "./common/MessageWrapperComponent"
import TextWrapperComponent from "./common/TextWrapperComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class AudioMessageComponent extends GeneralMessageComponent {

    h() {
        let audioSrc = this.message.raw.media.document.real ? this.message.raw.media.document.real.url : "";
        return (
            <MessageWrapperComponent message={this.message}>
                <audio controls src={audioSrc} type={this.message.raw.media.document.mime_type}/>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperComponent>
        )
    }
}

export default AudioMessageComponent