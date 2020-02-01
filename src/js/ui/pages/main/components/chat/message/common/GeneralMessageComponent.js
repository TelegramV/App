import Component from "../../../../../../v/vrdom/Component"
import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import type {BusEvent} from "../../../../../../../api/eventBus/EventBus"
import {EventBus} from "../../../../../../../api/eventBus/EventBus"
import type {Message} from "../../../../../../../api/messages/Message"
import {ReplyFragment} from "./ReplyFragment"
import {ForwardedHeaderFragment} from "./ForwardedHeaderFragment"

class GeneralMessageComponent extends Component {

    message: Message
    prevReadStatus: boolean = false
    intersectionObserver: IntersectionObserver

    showAvatar: boolean = true

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

        this.$avatar = this.$el.querySelector(`#message-${this.message.id}-avatar`)

        if (this.$el.previousElementSibling) {
            if (this.$el.previousElementSibling.getAttribute("data-peer") === this.$el.getAttribute("data-peer")) {
                this.showAvatar = false
                if (this.$avatar) {
                    this.$avatar.style.opacity = 0
                }
            }
        } else if (this.$el.nextElementSibling) {
            if (this.$el.nextElementSibling.getAttribute("data-peer") === this.$el.getAttribute("data-peer")) {
                this.showAvatar = false
                const $next = this.$el.nextElementSibling.querySelector(`#${this.$el.nextElementSibling.id}-avatar`)
                if ($next) {
                    $next.style.opacity = 0
                }
            }
        }
    }

    reactiveChanged(key: string, value: any, event: BusEvent) {
        if (key === "message") {
            if (event.type === "edit") {
                this.messageOnEdit()
            } else if (event.type === "replyToMessageFound") {
                this.messageOnReplyFound()
            } else if (event.type === "replyToMessageNotFound") {
                this.messageOnReplyNotFound()
            } else if (event.type === "forwardedNameOnlyFound" || event.type === "forwardedUserFound" || event.type === "forwardedChannelFound") {
                this.messageOnForwardedFound()
            }
        }
    }

    messageOnReplyFound() {
        if (this.__.mounted) {
            VRDOM.patch(
                this.$el.querySelector(`#message-${this.message.id}-rpl`),
                <ReplyFragment
                    id={`message-${this.message.id}-rpl`}
                    messageId={this.message.id}
                    show={true}
                    name={this.message.replyToMessage.from.name}
                    text={this.message.replyToMessage.text}/>
            )
        }
    }

    messageOnReplyNotFound() {
        if (this.__.mounted) {
            VRDOM.patch(
                this.$el.querySelector(`#message-${this.message.id}-rpl`),
                <ReplyFragment
                    id={`message-${this.message.id}-rpl`}
                    show={true}
                    name={"Deleted message"}
                    text={"Deleted message"}/>
            )
        }
    }

    messageOnForwardedFound() {
        if (this.__.mounted) {
            VRDOM.patch(
                this.$el.querySelector(`#message-${this.message.id}-fwd`),
                <ForwardedHeaderFragment message={this.message}/>
            )
        }
    }

    messageOnEdit() {
        this.__patch()
    }

    messageOnDelete() {
        this.__delete()
    }

    messageOnRead() {
        this.$el.classList.add("read")
    }

    eventFired(bus: EventBus, event: any): boolean {
        if (bus === AppEvents.Dialogs) {
            if ((event.type === "deleteMessages" || event.type === "deleteChannelMessages") && event.messages.indexOf(this.message.id) > -1) {
                this.messageOnDelete()
                return false
            } else if (this.message === event.message) {
                if (event.type === "editMessage") {
                    this.messageOnEdit()
                    return false
                }
            } else if (
                event.type === "updateReadOutboxMaxId"
            ) {
                if (this.message.isRead !== this.prevReadStatus && this.message.isOut) {
                    this.messageOnRead()
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