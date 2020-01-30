import {MessageType} from "../../../../api/messages/Message"
import UnsupportedMessageComponent from "../components/chat/message/UnsupportedMessageComponent"
import TextMessageComponent from "../components/chat/message/TextMessageComponent"
import PhotoMessageComponent from "../components/chat/message/photo/PhotoMessageComponent"
import LocationMessageComponent from "../components/chat/message/LocationMessageComponent"
import GameMessageComponent from "../components/chat/message/GameMessageComponent"
import PollMessageComponent from "../components/chat/message/PollMessageComponent"
import InvoiceMessageComponent from "../components/chat/message/InvoiceMessageComponent"
import WebpageMessageComponent from "../components/chat/message/WebpageMessageComponent"
import ContactMessageComponent from "../components/chat/message/ContactMessageComponent"
import DocumentMessageComponent from "../components/chat/message/DocumentMessageComponent"
import VideoMessageComponent from "../components/chat/message/VideoMessageComponent"
import StickerMessageComponent from "../components/chat/message/StickerMessageComponent"
import VoiceMessageComponent from "../components/chat/message/VoiceMessageComponent"
import AudioMessageComponent from "../components/chat/message/AudioMessageComponent"
import RoundVideoMessageComponent from "../components/chat/message/RoundVideoMessageComponent"
import PhoneCallMessageComponent from "../components/chat/message/PhoneCallMessageComponent"
import ServiceMessageComponent from "../components/chat/message/ServiceMessageComponent"
import AnimatedStickerMessageComponent from "../components/chat/message/AnimatedStickerMessageComponent"

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
    [MessageType.ANIMATED_STICKER, AnimatedStickerMessageComponent],
    [MessageType.STICKER, StickerMessageComponent],
    [MessageType.VOICE, VoiceMessageComponent],
    [MessageType.AUDIO, AudioMessageComponent],
    [MessageType.ROUND, RoundVideoMessageComponent],
    [MessageType.VIDEO, VideoMessageComponent],
    [MessageType.PHONE_CALL, PhoneCallMessageComponent],
    [MessageType.SERVICE, ServiceMessageComponent],
    [MessageType.ANIMATED_EMOJI, AnimatedStickerMessageComponent]
])

/**
 * @param message
 * @param intersectionObserver
 * @return {*}
 * @constructor
 */
const MessageComponent = ({message, intersectionObserver}) => {
    const Handler = handlers.get(message.type)

    if (Handler) {
        return <Handler intersectionObserver={intersectionObserver} message={message}/>
    } else {
        return (
            <UnsupportedMessageComponent message={message}/>
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