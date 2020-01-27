// @flow

import Component from "../../../../../../v/vrdom/component"
import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import {EventBus} from "../../../../../../../api/eventBus/EventBus"
import type {Message} from "../../../../../../../api/messages/Message"
import {ReplyFragment} from "./ReplyFragment"

class GeneralMessageComponent extends Component {

    message: Message
    prevReadStatus: boolean = false

    init() {
        this.message = this.props.message

        this.reactive = {
            message: this.message
        }

        this.prevReadStatus = this.message.isRead
        this.appEvents.add(AppEvents.Dialogs.reactiveAnySingle(this.message.dialog).FireOnly)
    }

    mounted() {
        this.message.show()
    }

    reactiveChanged(key: *, value: *, event: *) {
        if (key === "message") {
            if (event.type === "show" || event.type === "edit") {
                this.__patch()
            } else if (event.type === "replyToMessageFound") {
                if (this.__.mounted) {
                    VRDOM.patch(
                        this.$el.querySelector(`#message-${this.message.id}-rpl`),
                        <ReplyFragment
                            id={`message-${this.message.id}-rpl`}
                            show={true}
                            name={this.message.replyToMessage.from.name}
                            text={this.message.replyToMessage.text}/>
                    )
                }
            }
        }
    }

    eventFired(bus: EventBus, event: any): boolean {
        if (bus === AppEvents.Dialogs) {
            if (event.type === "deleteMessages" && event.messages.indexOf(this.message.id) > -1) {
                this.__delete()
                return false
            } else if (this.message === event.message) {
                if (event.type === "editMessage") {
                    this.__patch()
                    return false
                }
            } else if (
                event.type === "updateReadOutboxMaxId" ||
                event.type === "updateReadInboxMaxId"
            ) {
                if (this.message.isRead !== this.prevReadStatus && this.message.isOut) {
                    this.__patch()
                }
            }
        }

        return true
    }
}

export default GeneralMessageComponent