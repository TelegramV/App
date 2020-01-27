// @flow

import {Dialog} from "../dataObjects/dialog/Dialog"
import {MessageParser} from "./MessageParser"
import {TextMessage} from "./objects/TextMessage"
import {UnsupportedMessage} from "./UnsupportedMessage"
import {PhotoMessage} from "./objects/PhotoMessage"
import type {Message} from "./Message"
import {MessageType} from "./Message"
import {LocationMessage} from "./objects/LocationMessage"
import {GameMessage} from "./objects/GameMessage"
import {PollMessage} from "./objects/PollMessage"
import {InvoiceMessage} from "./objects/InvoiceMessage"
import {WebpageMessage} from "./objects/WebpageMessage"
import {ContactMessage} from "./objects/ContactMessage"
import {DocumentMessage} from "./objects/DocumentMessage"
import {VideoMessage} from "./objects/VideoMessage"
import {StickerMessage} from "./objects/StickerMessage"
import {VoiceMessage} from "./objects/VoiceMessage"
import {AudioMessage} from "./objects/AudioMessage"
import {RoundVideoMessage} from "./objects/RoundVideoMessage"
import {PhoneCallMessage} from "./objects/PhoneCallMessage"
import {ServiceMessage} from "./objects/ServiceMessage"
import {AnimatedStickerMessage} from "./objects/AnimatedStickerMessage"

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
    [MessageType.GIF, VideoMessage], //TODO own gif component
    [MessageType.STICKER, StickerMessage],
    [MessageType.VOICE, VoiceMessage],
    [MessageType.AUDIO, AudioMessage],
    [MessageType.ROUND, RoundVideoMessage],
    [MessageType.VIDEO, VideoMessage],
    [MessageType.PHONE_CALL, PhoneCallMessage],
    [MessageType.SERVICE, ServiceMessage],
    [MessageType.ANIMATED_EMOJI, AnimatedStickerMessage]
])

export class MessageFactory {

    static fromRaw(dialog: Dialog, raw: Object): Message {
        const type = MessageParser.getType(raw)

        if (messageObjects.has(type)) {
            // $ignore
            return new (messageObjects.get(type))(dialog, raw).fillRaw(raw)
        } else {
            return new UnsupportedMessage(dialog).fillRaw(raw)
        }
    }
}