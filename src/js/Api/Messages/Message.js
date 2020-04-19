// @flow

import {Peer} from "../Peers/Objects/Peer"
import {Dialog} from "../Dialogs/Dialog"

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
    GROUP: 20,
    ANIMATED_STICKER: 21,
    DICE: 22,
}

export interface Message {

    +type: number,
    +raw: Object;

    /**
     * @deprecated
     */
    +dialog: Dialog; // we should not use this thing and use `to` instead, should be deprecated

    +id: number;
    +to: Peer;
    +from: Peer;
    +date: number;
    +text: string;

    +isOut: boolean;
    +isRead: boolean;
    +isInRead: boolean;
    +isSending: boolean;
    +isMentioned?: boolean;
    +isMediaUnread?: boolean; // todo: implement this thing
    +isSilent?: boolean;
    +isPost?: boolean;
    +isFromScheduled?: boolean;
    +isLegacy?: boolean;
    +isEditHide?: boolean;
    +isPinned: boolean;
    +replyToMessage?: Message;
    +replyMarkup?: any;
    +forwarded?: any;
    +forwardedMessageId?: number;
    +editDate?: number;
    +isDisplayedInMediaViewer: boolean;
    // It's actually long?
    +groupedId?: string;
    +group: Array<Message> | undefined;
    +groupInitializer: boolean;

    +prefix: string; // why this is here??

    show(): void;

    init(): void;

    read(): Promise;

    fillRaw(raw: Object): Message;

}