import {MessageType} from "../../../../../api/messages/Message"
import UnsupportedMessageComponent from "./message/UnsupportedMessageComponent"
import TextMessageComponent from "./message/TextMessageComponent"
import PhotoMessageComponent from "./message/photo/PhotoMessageComponent"
import LocationMessageComponent from "./message/LocationMessageComponent"
import GameMessageComponent from "./message/GameMessageComponent"
import PollMessageComponent from "./message/PollMessageComponent"
import InvoiceMessageComponent from "./message/InvoiceMessageComponent"
import WebpageMessageComponent from "./message/WebpageMessageComponent"
import ContactMessageComponent from "./message/ContactMessageComponent"
import DocumentMessageComponent from "./message/DocumentMessageComponent"
import VideoMessageComponent from "./message/video/VideoMessageComponent"
import GIFMessageComponent from "./message/GIFMessageComponent"
import StickerMessageComponent from "./message/StickerMessageComponent"
import VoiceMessageComponent from "./message/VoiceMessageComponent"
import AudioMessageComponent from "./message/AudioMessageComponent"
import RoundVideoMessageComponent from "./message/RoundVideoMessageComponent"
import PhoneCallMessageComponent from "./message/PhoneCallMessageComponent"
import ServiceMessageComponent from "./message/ServiceMessageComponent"
import AnimatedStickerMessageComponent from "./message/AnimatedStickerMessageComponent"
import GroupedMessageComponent from "./message/GroupedMessageComponent";

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
    [MessageType.GIF, GIFMessageComponent],
    [MessageType.ANIMATED_STICKER, AnimatedStickerMessageComponent],
    [MessageType.STICKER, StickerMessageComponent],
    [MessageType.VOICE, VoiceMessageComponent],
    [MessageType.AUDIO, AudioMessageComponent],
    [MessageType.ROUND, RoundVideoMessageComponent],
    [MessageType.VIDEO, VideoMessageComponent],
    [MessageType.PHONE_CALL, PhoneCallMessageComponent],
    [MessageType.SERVICE, ServiceMessageComponent],
    [MessageType.ANIMATED_EMOJI, AnimatedStickerMessageComponent],
    [MessageType.GROUP, GroupedMessageComponent]
])

/**
 * @param message
 * @param intersectionObserver
 * @return {*}
 * @constructor
 */
const MessageComponent = ({message, intersectionObserver}) => {
    const Handler = handlers.get(message.groupedId ? MessageType.GROUP : message.type)

    if (Handler) {
        return <Handler intersectionObserver={intersectionObserver} message={message}/>
    } else {
        return (
            <UnsupportedMessageComponent message={message}/>
        )
    }
}

export default MessageComponent