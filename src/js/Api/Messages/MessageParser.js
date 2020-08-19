import type {Message} from "./Message"
import {MessageType} from "./Message"
import {StickerManager} from "../Stickers/StickersManager";

export class MessageParser {

    static getType(messageConstructor: Object) {
        let type = MessageType.TEXT
        const message = messageConstructor
        const media = message.media

        if (media) {
            if(media.ttl_seconds) {
                return MessageType.TTL; // TODO remove special type when properly implemented
            }
            switch (media._) {
                case "messageMediaPhoto":
                    type = MessageType.PHOTO
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
                case "messageMediaDice":
                    type = MessageType.DICE
                    break;
                case "messageMediaDocument": {
                    type = MessageType.DOCUMENT

                    const attrs = media.document.attributes;
                    for (const attr of attrs) {
                        if (attr._ === "documentAttributeSticker") {
                            if (media.document.mime_type === "application/x-tgsticker") {
                                type = MessageType.ANIMATED_STICKER
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
                            if (attr.voice) {
                                type = MessageType.VOICE
                                break;
                            } else {
                                type = MessageType.AUDIO
                                break;
                            }
                        }
                        if (attr._ === "documentAttributeVideo") { //tl;dr do not add break here, of GIF's will be broken
                            if (attr.round_message) {
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
            const emoji = StickerManager.getAnimatedEmoji(message.message)

            if (emoji) {
                type = MessageType.ANIMATED_EMOJI
                message.media = {
                    _: "messageMediaDocument",
                    document: emoji
                }
            }
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
        if(!message) {
            return "";
        }
        if (message.groupedId) {
            return "Album"
        }
        switch (message.type) {
            case MessageType.PHOTO:
                return "Photo"
            case MessageType.GEO:
            case MessageType.VENUE:
                return "Location"
            case MessageType.GEO_LIVE:
                return "Live Location"
            case MessageType.GAME:
                return "🎮 " + message.raw?.media?.game?.title ?? ""
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
            case MessageType.ANIMATED_STICKER:
                if (message.raw.media && message.raw.media.document) {
                    return MessageParser.getStickerEmoji(message.raw.media.document) + " Sticker"
                } else {
                    return `${message.text} Sticker`
                }
            case MessageType.VOICE:
                return "Voice"
            case MessageType.AUDIO:
                return "Audio"
            case MessageType.ROUND:
            case MessageType.VIDEO:
                return "Video"
            case MessageType.PHONE_CALL:
                return "Phone call"
            case MessageType.SERVICE:
                return "Service message"
            case MessageType.DICE:
                return message.emoji;
            case MessageType.GROUP:
                return "Album"
            case MessageType.ANIMATED_EMOJI:
            case MessageType.TEXT:
            case MessageType.WEB_PAGE:
                return "";
            case MessageType.TTL:
                return "Self-destruct message"
            default:
                return "Unsupported"
        }
    }

    static getPrefixNoSender(message) {
        const p = MessageParser.getMediaPreviewName(message)
        if (message.raw.media && p.length > 0) {
            return p + (message.text.length > 0 ? ", " + message.text : "")
        } else {
            return message.text
        }
    }

    static getDialogPrefix(message: Message) {
        const from = message.from
        const showSender = (message.isOut || message.from !== message.to) && !message.isPost
        const peerName = message.isOut ? "You" : from.firstName

        let text = ""

        const p = MessageParser.getMediaPreviewName(message)

        //if (message.raw.media) { // p is not only media
        if (p.length > 0) {
            text = (showSender ? peerName + ": " : "") + p + (message.text.length > 0 ? ", " : "")
        } else {
            text = (showSender ? peerName + ": " : "")
        }
        /*} else if (message.text.length > 0 && showSender) {
            text += peerName + ": "
        }*/

        return text
    }
}