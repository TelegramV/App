import Component from "../../../../../../v/vrdom/Component"
import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import {EventBus} from "../../../../../../../api/eventBus/EventBus"
import type {Message} from "../../../../../../../api/messages/Message"
import {ReplyFragment} from "./ReplyFragment"
import {ForwardedHeaderFragment} from "./ForwardedHeaderFragment"

class GeneralMessageComponent extends Component {

    message: Message
    prevReadStatus: boolean = false
    intersectionObserver: IntersectionObserver

    editedIdPrefix = "msg-edited-"
    readIdPrefix = "msg-read-"

    init() {
        this.intersectionObserver = this.props.intersectionObserver
        this.message = this.props.message

        this.reactive = {
            message: this.message
        }

        this.prevReadStatus = this.message.isRead
        this.appEvents.add(AppEvents.Dialogs.reactiveAnySingle(this.message.dialog).FireOnly)
    }

    mounted() {
        this.message.show()
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(this.$el)
        }
    }

    reactiveChanged(key: *, value: *, event: *) {
        if (key === "message") {
            if (event.type === "edit") {
                this.onEdit()
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
            } else if (event.type === "forwardedNameOnlyFound" || event.type === "forwardedUserFound" || event.type === "forwardedChannelFound") {
                if (this.__.mounted) {
                    VRDOM.patch(
                        this.$el.querySelector(`#message-${this.message.id}-fwd`),
                        <ForwardedHeaderFragment message={this.message}/>
                    )
                }
            }
        }
    }

    onEdit() {
        this.__patch()
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

    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.unobserve(this.$el)
        }
    }
}

export default GeneralMessageComponent