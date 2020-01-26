import type {Message} from "./Message"
import type {MessageConstructor} from "../../mtproto/language/types"
import {MessageType} from "./Message"

export class MessageParser {

    static getType(messageConstructor: MessageConstructor) {
        let type = MessageType.TEXT
        const message = messageConstructor
        const media = message.media

        if (media) {
            switch (media._) {
                case "messageMediaPhoto":
                    return MessageType.PHOTO
                    break;
                case "messageMediaGeo":
                    type = MessageType.GEO
                    break;
                case "messageMediaGeoLive":
                    type = MessageType.GEO_LIVE
                    break;
                case "messageMediaVenue":
                    type = MessageType.VENUE;
                    break;
                case "messageMediaGame":
                    type = MessageType.GAME
                    break;
                case "messageMediaPoll":
                    type = MessageType.POLL
                    break;
                case "messageMediaInvoice":
                    type = MessageType.INVOICE
                    break;
                case "messageMediaWebPage":
                    type = MessageType.WEB_PAGE
                    break;
                case "messageMediaContact":
                    type = MessageType.CONTACT
                    break;
                case "messageMediaDocument": {
                    type = MessageType.DOCUMENT

                    const attrs = media.document.attributes;
                    for (const attr of attrs) {
                        if (attr._ === "documentAttributeSticker") {
                            if (media.isAnimatedEmoji) {
                                type = MessageType.ANIMATED_EMOJI
                            } else {
                                type = MessageType.STICKER
                            }
                            break;
                        }
                        if (attr._ === "documentAttributeAnimated") {
                            type = MessageType.GIF
                            break;
                        }
                        if (attr._ === "documentAttributeAudio") {
                            if (attr.pFlags.voice) {
                                type = MessageType.VOICE
                                break;
                            } else {
                                type = MessageType.AUDIO
                                break;
                            }
                        }
                        if (attr._ === "documentAttributeVideo") { //tl;dr do not add break here, of GIF's will be broken
                            if (attr.pFlags.round_message) {
                                type = MessageType.ROUND
                            } else {
                                type = MessageType.VIDEO
                            }
                        }
                    }
                }
                    break;
                case "messageMediaEmpty":
                    type = MessageType.TEXT
                    break
                case "messageMediaUnsupported":
                default:
                    console.log("unsupported", message.media);
                    type = MessageType.UNSUPPORTED;
                    break
            }
        } else {
            // const l = StickerManager.getAnimatedEmoji(message.message)
            // if (l) {
            //     this.raw.media = {
            //         _: "messageMediaDocument",
            //         isAnimatedEmoji: true,
            //         document: l
            //     }
            //     this.parseMessageType()
            //     return
            // }
        }

        if (message._ === "messageService") {
            switch (message.action._) {
                case "messageActionPhoneCall":
                    type = MessageType.PHONE_CALL
                    break
                default:
                    type = MessageType.SERVICE
                    break
            }
        }

        return type
    }

    static getStickerEmoji(document) {
        for (const attr of document.attributes) {
            if (attr._ === "documentAttributeSticker") {
                return attr.alt
            }
        }
        return ""
    }

    static getMediaPreviewName(message: Message) {
        switch (message.type) {
            case MessageType.PHOTO:
                return "Photo"
            case MessageType.GEO:
            case MessageType.VENUE:
                return "Location"
            case MessageType.GEO_LIVE:
                return "Live Location"
            case MessageType.GAME:
                return "🎮 " + message.raw.media.game.title
            case MessageType.POLL:
                return message.raw.media.poll.question;
            case MessageType.INVOICE:
                return "Invoice"
            case MessageType.CONTACT:
                return "Contact"
            case MessageType.DOCUMENT:
                return "Document"
            case MessageType.GIF:
                return "GIF"
            case MessageType.STICKER:
                return MessageParser.getStickerEmoji(message.raw.media.document) + " Sticker"
            case MessageType.VOICE:
                return "Voice"
            case MessageType.AUDIO:
                return "Audio"
            case MessageType.ROUND:
            case MessageType.VIDEO:
                return "Video"
            case MessageType.PHONE_CALL:
                return "Phone call"
            case MessageType.TEXT:
            case MessageType.WEB_PAGE:
                return "";
            case MessageType.SERVICE:
                return "Service message"
            default:
                return "Unsupported"
        }
    }

    static getDialogPrefix(message) {
        const from = message.from
        const showSender = (message.isOut || message.from !== message.dialog.peer) && !message.isPost
        const peerName = message.isOut ? "You" : from.name

        let text = ""

        const p = MessageParser.getMediaPreviewName(message)
        if (message.media) {

            if (p.length > 0) {
                text = (showSender ? peerName + ": " : "") + p + (message.text.length > 0 ? ", " : "")
            }
        } else if (message.text.length > 0 && showSender) {
            text += peerName + ": "
        }

        return text
    }
}