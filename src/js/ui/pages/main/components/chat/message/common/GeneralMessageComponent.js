import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import type {BusEvent} from "../../../../../../../api/eventBus/EventBus"
import type {Message} from "../../../../../../../api/messages/Message"
import {ReplyFragment} from "./ReplyFragment"
import {ForwardedHeaderFragment} from "./ForwardedHeaderFragment"
import {VComponent} from "../../../../../../v/vrdom/component/VComponent"
import UIEvents from "../../../../../../eventBus/UIEvents";
import {MessageParser} from "../../../../../../../api/messages/MessageParser";

class GeneralMessageComponent extends VComponent {

    useProxyState = false

    message: Message
    prevReadStatus: boolean = false
    intersectionObserver: IntersectionObserver

    avatarRef = VComponent.createComponentRef()
    bubbleRef = VComponent.createRef()

    init() {
        this.intersectionObserver = this.props.intersectionObserver
        this.message = this.props.message

        this.prevReadStatus = this.message.isRead
    }

    mounted() {
        this.$el.__message = this.message
        this.message.show()

        if (this.intersectionObserver) {
            this.intersectionObserver.observe(this.$el)
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("deleteMessages", this.onMessagesDeleteEvent)
            .on("deleteChannelMessages", this.onMessagesDeleteEvent)
            .on("editMessage", this.messageOnEdit)
            .on("updateReadOutboxMaxId", this.onReadOutboxMaxId)
    }

    reactive(R) {
        R.object(this.message)
            .on("edit", this.messageOnEdit)
            .on("replyToMessageFound", this.messageOnReplyFound)
            .on("replyToMessageNotFound", this.messageOnReplyNotFound)
            .on("forwardedNameOnlyFound", this.messageOnForwardedFound)
            .on("forwardedChannelFound", this.messageOnForwardedFound)
    }

    onMessagesDeleteEvent = (event: BusEvent) => {
        if (event.messages.indexOf(this.message.id) > -1) {
            this.messageOnDelete()
        }
    }

    onReadOutboxMaxId = (event: BusEvent) => {
        if (this.message.isRead !== this.prevReadStatus && this.message.isOut) {
            this.prevReadStatus = this.message.isRead
            this.messageOnRead()
        }
    }

    messageOnReplyFound = () => {
        if (this.__.mounted) {
            VRDOM.patch(
                this.$el.querySelector(`#message-${this.message.id}-rpl`),
                <ReplyFragment
                    id={`message-${this.message.id}-rpl`}
                    messageId={this.message.id}
                    show={true}
                    name={this.message.replyToMessage.from.name}
                    text={MessageParser.getPrefixNoSender(this.message.replyToMessage)}
                    onClick={l => UIEvents.Bubbles.fire("showMessage", this.message.replyToMessage)}/>
            )
        }
    }

    messageOnReplyNotFound = () => {
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

    messageOnForwardedFound = () => {
        if (this.__.mounted) {
            VRDOM.patch(
                this.$el.querySelector(`#message-${this.message.id}-fwd`),
                <ForwardedHeaderFragment message={this.message}/>
            )
        }
    }

    messageOnEdit = () => {
        this.message.show()
        this.__patch()
    }

    messageOnDelete = () => {
        this.__delete()
    }

    messageOnRead = () => {
        this.$el.classList.add("read")
    }

    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.unobserve(this.$el)
        }
    }
}

export default GeneralMessageComponent