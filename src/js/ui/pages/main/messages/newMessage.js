import { parseMessageEntities } from "../../../../mtproto/utils/htmlHelpers";
import { FileAPI } from "../../../../api/fileAPI"
import {LocaleController} from "../../../../common/locale/localization"
import MessageWrapperComponent from "../components/chat/message/messageWrapperComponent";
import TextMessageComponent from "../components/chat/message/textMessageComponent";
import ServiceMessageComponent from "../components/chat/message/serviceMessageComponent";
import AudioMessageComponent from "../components/chat/message/audioMessageComponent";
import VoiceMessageComponent from "../components/chat/message/voiceMessageComponent";
import VideoMessageComponent from "../components/chat/message/videoMessageComponent";
import RoundVideoMessageComponent from "../components/chat/message/roundVideoMessageComponent";
import WebpageMessageComponent from "../components/chat/message/webpageMessageComponent";
import StickerMessageComponent from "../components/chat/message/stickerMessageComponent";
import PhotoMessageComponent from "../components/chat/message/photoMessageComponent";
import ContactMessageComponent from "../components/chat/message/contactMessageComponent";
import DocumentMessageComponent from "../components/chat/message/documentMessageComponent";
import PhoneCallMessageComponent from "../components/chat/message/phoneCallMessageComponent";

const Message = ({ message }) => {
    /*if (!message.type) {
        return <div>Unsupported message type</div>
    }*/

    const handlers = {
        text: TextMessageComponent,
        photo: PhotoMessageComponent,
        round: RoundVideoMessageComponent,
        video: VideoMessageComponent,
        audio: AudioMessageComponent,
        voice: VoiceMessageComponent,
        sticker: StickerMessageComponent,
        document: DocumentMessageComponent,
        //location:
        //beacon:
        //game:
        //poll:
        //invoice:
        phoneCall: PhoneCallMessageComponent,
        contact: ContactMessageComponent,
        webpage: WebpageMessageComponent,
        service: ServiceMessageComponent
    }

    const Handler = handlers[message.type]

    if (Handler) {
        return <Handler message={message}/>
    } else {
        message._message.message = "Unsupported message type!"
        return (
            <TextMessageComponent message={message}/>
        )
    }
}

function isBigMedia(message) {
    if (!message.media) return false;
    let media = message.media;
    if (media.photo) return true;
    return false;
}



export default Message;