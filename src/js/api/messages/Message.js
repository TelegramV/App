// @flow

import type {MessageConstructor} from "../../mtproto/language/types"
import {Peer} from "../dataObjects/peer/Peer"

export const MessageType = {
    UNSUPPORTED: -1,
    TEXT: 0,
    PHOTO: 1,
    GEO: 2,
    GEO_LIVE: 3,
    VENUE: 4,
    GAME: 5,
    POLL: 6,
    INVOICE: 7,
    WEB_PAGE: 8,
    CONTACT: 9,
    DOCUMENT: 10,
    GIF: 11,
    STICKER: 12,
    VOICE: 13,
    AUDIO: 14,
    ROUND: 15,
    VIDEO: 16,
    PHONE_CALL: 17,
    SERVICE: 18,
    ANIMATED_EMOJI: 19,
    GROUP_PHOTO: 1,
}

export interface Message {

    +type: number,
    +raw: MessageConstructor;

    +id: number;
    +to: Peer;
    +from: Peer;
    +date: number;
    +text: string;

    +isOut: boolean;
    +isRead: boolean;
    +isMentioned: boolean;
    +isMediaUnread: boolean;
    +isSilent: boolean;
    +isPost: boolean;
    +isFromScheduled: boolean;
    +isLegacy: boolean;
    +isEditHide: boolean;

    +prefix: string; // why this is here??

    show(): void;

    fillRaw(raw: MessageConstructor): void;

}