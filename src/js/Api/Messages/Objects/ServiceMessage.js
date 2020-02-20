// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class ServiceMessage extends AbstractMessage {

    type = MessageType.SERVICE

    get text(): string {
        const action = this.raw.action
        const msg = action._
        if (msg === "messageActionPinMessage") {
            /*
                TODO: get replied message, test for media or text, select needed data
            */
            let user = this.from.name;
            let text = "TODO"
            //return L("lng_action_pinned_message", {from: user, text: text})
            return `${user} pinned a message`
        } else if (msg === "messageActionChatCreate") {
            return `Chat created`
        } else if (msg === "messageActionChatEditTitle") {
            return `Group title changed to ${action.title}`
        } else if (msg === "messageActionChatEditPhoto") {
            return `Group avatar changed`
        } else if (msg === "messageActionChatDeletePhoto") {
            return `Group avatar removed`
        }
        return "Service Message [IMPLEMENT ME]"
    }

    show() {
        super.show()
    }
}