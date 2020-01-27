// @flow

import Component from "../../../../../../v/vrdom/component"
import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import {EventBus} from "../../../../../../../api/eventBus/EventBus"
import type {Message} from "../../../../../../../api/messages/Message"

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

    created() {
        this.message.show()
    }

    reactiveChanged(key: *, value: *, event: *) {
        if (key === "message") {
            if (event.type === "show" || event.type === "edit") {
                this.__patch()
            }
        }
    }

    eventFired(bus: EventBus, event: any): boolean {
        if (bus === AppEvents.Dialogs) {
            console.log("deleting request",event)
            if (event.type === "deleteMessages" && event.messages.indexOf(this.message.id) > -1) {
                console.log("deleting request")
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