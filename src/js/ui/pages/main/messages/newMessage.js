import TextMessageComponent from "../components/chat/message/TextMessageComponent";
import ServiceMessageComponent from "../components/chat/message/serviceMessageComponent";
import AudioMessageComponent from "../components/chat/message/audioMessageComponent";
import VoiceMessageComponent from "../components/chat/message/VoiceMessageComponent";
import VideoMessageComponent from "../components/chat/message/videoMessageComponent";
import RoundVideoMessageComponent from "../components/chat/message/roundVideoMessageComponent";
import WebpageMessageComponent from "../components/chat/message/webpageMessageComponent";
import StickerMessageComponent from "../components/chat/message/stickerMessageComponent";
import PhotoMessageComponent from "../components/chat/message/photoMessageComponent";
import ContactMessageComponent from "../components/chat/message/contactMessageComponent";
import DocumentMessageComponent from "../components/chat/message/documentMessageComponent";
import PhoneCallMessageComponent from "../components/chat/message/phoneCallMessageComponent";
import LocationMessageComponent from "../components/chat/message/locationMessageComponent";
import GameMessageComponent from "../components/chat/message/gameMessageComponent";
import InvoiceMessageComponent from "../components/chat/message/invoiceMessageComponent";
import PollMessageComponent from "../components/chat/message/PollMessageComponent";
import {MessageType} from "../../../../api/dataObjects/messages/Message"

/**
 * @type {Map<number, function({message: *}): *>}
 */
const handlers = new Map([
    [MessageType.TEXT, TextMessageComponent],
    [MessageType.PHOTO, PhotoMessageComponent],
    [MessageType.GEO, LocationMessageComponent],
    [MessageType.GEO_LIVE, LocationMessageComponent],
    [MessageType.VENUE, LocationMessageComponent],
    [MessageType.GAME, GameMessageComponent],
    [MessageType.POLL, PollMessageComponent],
    [MessageType.INVOICE, InvoiceMessageComponent], //requires encryption, component just tells to use other app
    [MessageType.WEB_PAGE, WebpageMessageComponent],
    [MessageType.CONTACT, ContactMessageComponent],
    [MessageType.DOCUMENT, DocumentMessageComponent],
    [MessageType.GIF, VideoMessageComponent], //TODO own gif component
    [MessageType.STICKER, StickerMessageComponent],
    [MessageType.VOICE, VoiceMessageComponent],
    [MessageType.AUDIO, AudioMessageComponent],
    [MessageType.ROUND, RoundVideoMessageComponent],
    [MessageType.VIDEO, VideoMessageComponent],
    [MessageType.PHONE_CALL, PhoneCallMessageComponent],
    [MessageType.SERVICE, ServiceMessageComponent],
    [MessageType.ANIMATED_EMOJI, StickerMessageComponent]
])

/**
 * @param message
 * @return {*}
 * @constructor
 */
const MessageComponent = ({message}) => {
    const Handler = handlers.get(message.type)

    if (Handler) {
        return <Handler message={message}/>
    } else {
        message.raw.message = "Unsupported message type!"
        message.raw.entities = undefined;
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


export default MessageComponent