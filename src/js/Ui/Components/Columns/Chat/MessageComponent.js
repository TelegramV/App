/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {MessageType} from "../../../../Api/Messages/Message"
import UnsupportedMessageComponent from "./Message/UnsupportedMessageComponent"
import TextMessageComponent from "./Message/TextMessageComponent"
import PhotoMessageComponent from "./Message/Photo/PhotoMessageComponent"
import LocationMessageComponent from "./Message/LocationMessageComponent"
import GameMessageComponent from "./Message/GameMessageComponent"
import PollMessageComponent from "./Message/PollMessageComponent"
import InvoiceMessageComponent from "./Message/InvoiceMessageComponent"
import WebpageMessageComponent from "./Message/WebpageMessageComponent"
import ContactMessageComponent from "./Message/ContactMessageComponent"
import DocumentMessageComponent from "./Message/DocumentMessageComponent"
import VideoMessageComponent from "./Message/Video/VideoMessageComponent"
import GIFMessageComponent from "./Message/GIFMessageComponent"
import StickerMessageComponent from "./Message/StickerMessageComponent"
import RoundVideoMessageComponent from "./Message/RoundVideoMessageComponent"
import PhoneCallMessageComponent from "./Message/PhoneCallMessageComponent"
import ServiceMessageComponent from "./Message/ServiceMessageComponent"
import AnimatedStickerMessageComponent from "./Message/AnimatedStickerMessageComponent"
import DiceMessageComponent from "./Message/DiceMessageComponent"
import GroupedMessageComponent from "./Message/GroupedMessageComponent";
import NewAudioMessageComponent from "./Message/NewAudioMessageComponent"
import NewVoiceMessageComponent from "./Message/NewVoiceMessageComponent"
import TTLMessageComponent from "./Message/TTLMessageComponent";

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
    [MessageType.DICE, DiceMessageComponent],
    [MessageType.STICKER, StickerMessageComponent],
    [MessageType.VOICE, NewVoiceMessageComponent],
    [MessageType.AUDIO, NewAudioMessageComponent],
    [MessageType.ROUND, RoundVideoMessageComponent],
    [MessageType.VIDEO, VideoMessageComponent],
    [MessageType.PHONE_CALL, PhoneCallMessageComponent],
    [MessageType.SERVICE, ServiceMessageComponent],
    [MessageType.ANIMATED_EMOJI, AnimatedStickerMessageComponent],
    [MessageType.GROUP, GroupedMessageComponent],

    [MessageType.TTL, TTLMessageComponent],
])

/**
 * @param message
 * @param intersectionObserver
 * @return {*}
 * @constructor
 */
const MessageComponent = ({message, ...attrs}) => {
    const Handler = handlers.get(message.type)

    if (Handler) {
        return <Handler message={message} {...attrs}/>
    } else {
        console.log(message.type)
        return (
            <UnsupportedMessageComponent message={message} {...attrs}/>
        )
    }
}

export default MessageComponent