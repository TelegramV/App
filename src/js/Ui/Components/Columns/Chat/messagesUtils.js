/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


import type {Message} from "../../../../Api/Messages/Message"
import {MessageType} from "../../../../Api/Messages/Message"
import MessageComponent from "./MessageComponent"
import vrdom_render from "../../../../V/VRDOM/render/render"
import {vrdom_appendRealMany} from "../../../../V/VRDOM/append"
import {vrdom_prependRealMany} from "../../../../V/VRDOM/prepend"

export function getMessageElement(message: number): HTMLElement | null {
    return document.getElementById(`message-${message.id}`); // dunno better way, sorry
}

export function fixMessages(messages: Message[]): Message[] {
    if (messages.length > 0 && messages[0].id > messages[messages.length - 1].id) {
        messages = messages.reverse();
    }

    messages = messages.filter(message => !document.getElementById(`message-${message.id}`));

    return messages;
}

export function isGrouping(one: Message, two: Message) {
    if (!one || !two ||
        one.type === MessageType.GROUP || two.type === MessageType.GROUP ||
        one.type === MessageType.SERVICE || two.type === MessageType.SERVICE) return false;
    if(one.type === MessageType.TEXT && one.isBigEmojis ||
        two.type === MessageType.TEXT && two.isBigEmojis) return false;
    return (one.isPost || one.isOut === two.isOut)
        && (one.from.id === two.from.id)
        && (Math.abs(one.date - two.date) < 5 * 60);
}

export function isSameDate(d1n, d2n) {
    if (!d1n || !d2n) {
        return true;
    }

    const d1 = new Date(d1n * 1000);
    const d2 = new Date(d2n * 1000);

    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

export function renderVRMessage(message: Message, prevMessage: Message = null, nextMessage: Message = null, observer) {
    const isOut = !message.isPost && message.isOut;

    message.hideAvatar = true;

    let prevCurr = isGrouping(prevMessage, message);
    let currNext = isGrouping(message, nextMessage);

    if (!prevCurr && currNext) {
        message.tailsGroup = "s";
    } else if (!currNext) {
        if (!prevCurr) {
            message.tailsGroup = "se";
        } else {
            message.tailsGroup = "e";
        }
        if (!isOut) message.hideAvatar = false;
    } else {
        message.tailsGroup = "m";
    }

    return <MessageComponent message={message}
                             observer={observer}
                             showDate={!isSameDate(message.date, prevMessage?.date)}
                             // isNewMessages={message.dialogPeer.messages.readInboxMaxId - 40 >= message.dialogPeer.messages.last?.id && message.dialogPeer.messages.readInboxMaxId === message.id}
    />;
}

export function renderMessage(message: Message, prevMessage: Message = null, nextMessage: Message = null, observer): HTMLElement {
    return vrdom_render(renderVRMessage(message, prevMessage, nextMessage, observer));
}

export function appendMessages($container: HTMLElement, messages: Message[], beforeTopMessage: Message = null, afterBottomMessage: Message = null, observer) {
    if (messages.length > 0) {
        if (__IS_DEV__) {
            if (!beforeTopMessage) {
                console.log("[warn] append no before message")
            }
            if (!afterBottomMessage) {
                console.log("[warn] append no after message")
            }
            if (beforeTopMessage && messages[0].id < beforeTopMessage.id) {
                console.error("append before", beforeTopMessage, messages)
            }
            if (afterBottomMessage && messages[messages.length - 1].id > afterBottomMessage.id) {
                console.error("append after", afterBottomMessage, messages)
            }
        }

        const $messages = [renderMessage(messages[0], beforeTopMessage, messages[1], observer)];

        //[0,1,2,3]
        //[x,0,1]
        //[0,1,2] loop
        //[1,2,3] loop
        //[2,3,y]
        for (let i = 1; i < messages.length - 1; i++) {
            $messages.push(renderMessage(messages[i], messages[i - 1], messages[i + 1], observer));
        }

        if (messages.length > 1) {
            $messages.push(renderMessage(messages[messages.length - 1], messages[messages.length - 2], afterBottomMessage, observer));
        }

        vrdom_appendRealMany($messages.reverse(), $container)

        return $messages;
    }

    return [];
}

export function prependMessages($container: HTMLElement, messages: Message[], beforeTopMessage: Message = null, afterBottomMessage: Message = null, observer) {
    if (messages.length > 0) {
        if (__IS_DEV__) {
            if (!beforeTopMessage) {
                console.log("[warn] prepend no before message")
            }
            if (!afterBottomMessage) {
                console.log("[warn] prepend no after message")
            }
            if (beforeTopMessage && messages[0].id < beforeTopMessage.id) {
                console.error("prepend before", beforeTopMessage, messages)
            }
            if (afterBottomMessage && messages[messages.length - 1].id > afterBottomMessage.id) {
                console.error("prepend after", afterBottomMessage, messages)
            }
        }

        const $messages = [renderMessage(messages[0], beforeTopMessage, messages[1], observer)];

        for (let i = 1; i < messages.length - 1; i++) {
            $messages.push(renderMessage(messages[i], messages[i - 1], messages[i + 1], observer));
        }

        if (messages.length > 1) {
            $messages.push(renderMessage(messages[messages.length - 1], messages[messages.length - 2], afterBottomMessage, observer));
        }

        $container.firstElementChild?.__v.component.domSiblingUpdated?.call(
            $container.firstElementChild?.__v.component,
            $container.firstElementChild?.nextElementSibling?.__v.component.props.message,
            messages[0],
        );

        vrdom_prependRealMany($messages, $container);

        return $messages;
    }

    return [];
}