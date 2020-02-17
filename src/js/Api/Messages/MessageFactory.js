// @flow

import {MessageParser} from "./MessageParser"
import {TextMessage} from "./Objects/TextMessage"
import {UnsupportedMessage} from "./UnsupportedMessage"
import {PhotoMessage} from "./Objects/PhotoMessage"
import type {Message} from "./Message"
import {MessageType} from "./Message"
import {LocationMessage} from "./Objects/LocationMessage"
import {GameMessage} from "./Objects/GameMessage"
import {PollMessage} from "./Objects/PollMessage"
import {InvoiceMessage} from "./Objects/InvoiceMessage"
import {WebpageMessage} from "./Objects/WebpageMessage"
import {ContactMessage} from "./Objects/ContactMessage"
import {DocumentMessage} from "./Objects/DocumentMessage"
import {VideoMessage} from "./Objects/VideoMessage"
import {GIFMessage} from "./Objects/GIFMessage"
import {StickerMessage} from "./Objects/StickerMessage"
import {VoiceMessage} from "./Objects/VoiceMessage"
import {AudioMessage} from "./Objects/AudioMessage"
import {RoundVideoMessage} from "./Objects/RoundVideoMessage"
import {PhoneCallMessage} from "./Objects/PhoneCallMessage"
import {ServiceMessage} from "./Objects/ServiceMessage"
import {AnimatedStickerMessage} from "./Objects/AnimatedStickerMessage"
import {Peer} from "../Peers/Objects/Peer"

const messageObjects = new Map([
    [MessageType.TEXT, TextMessage],
    [MessageType.PHOTO, PhotoMessage],
    [MessageType.GEO, LocationMessage],
    [MessageType.GEO_LIVE, LocationMessage],
    [MessageType.VENUE, LocationMessage],
    [MessageType.GAME, GameMessage],
    [MessageType.POLL, PollMessage],
    [MessageType.INVOICE, InvoiceMessage], //requires encryption, component just tells to use other app
    [MessageType.WEB_PAGE, WebpageMessage],
    [MessageType.CONTACT, ContactMessage],
    [MessageType.DOCUMENT, DocumentMessage],
    [MessageType.GIF, GIFMessage],
    [MessageType.STICKER, StickerMessage],
    [MessageType.ANIMATED_STICKER, AnimatedStickerMessage],
    [MessageType.ANIMATED_EMOJI, AnimatedStickerMessage],
    [MessageType.VOICE, VoiceMessage],
    [MessageType.AUDIO, AudioMessage],
    [MessageType.ROUND, RoundVideoMessage],
    [MessageType.VIDEO, VideoMessage],
    [MessageType.PHONE_CALL, PhoneCallMessage],
    [MessageType.SERVICE, ServiceMessage],
])

export class MessageFactory {

    static fromRaw(dialogPeer: Peer, raw: Object): Message {
        const type = MessageParser.getType(raw)

        if (messageObjects.has(type)) {
            return new (messageObjects.get(type))(dialogPeer, raw).fillRaw(raw)
        } else {
            return new UnsupportedMessage(dialogPeer).fillRaw(raw)
        }
    }
}