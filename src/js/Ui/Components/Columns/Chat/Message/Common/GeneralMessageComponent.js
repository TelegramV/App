import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
import type {Message} from "../../../../../../Api/Messages/Message"
import {ReplyFragment} from "./ReplyFragment"
import {ForwardedHeaderFragment} from "./ForwardedHeaderFragment"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../../../EventBus/UIEvents";
import {MessageParser} from "../../../../../../Api/Messages/MessageParser";

class GeneralMessageComponent extends VComponent {

    useProxyState = false

    message: Message
    prevReadStatus: boolean = false
    // intersectionObserver: IntersectionObserver

    avatarRef = VComponent.createComponentRef()
    bubbleRef = VComponent.createRef()

    init() {
        // this.intersectionObserver = this.props.intersectionObserver
        this.message = this.props.message
    }

    componentDidMount() {
        this.$el.__message = this.message
        this.message.show()

        // if (this.intersectionObserver) {
        //     this.intersectionObserver.observe(this.$el)
        // }
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
        if (this.message.id <= this.message.to.messages.readOutboxMaxId && this.message.isOut) {
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
                    onClick={l => UIEvents.General.fire("chat.showMessage", {message: this.message.replyToMessage})}/>
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

    messageOnEdit = event => {
        if (event.message === this.message) {
            this.message.show()
            this.forceUpdate()
        }
    }

    messageOnDelete = () => {
        this.__destroy()
    }

    messageOnRead = () => {
        if (this.bubbleRef.$el) {
            if (this.message.isRead && !this.bubbleRef.$el.classList.contains("read")) {
                this.bubbleRef.$el.classList.add("read")
                this.bubbleRef.$el.classList.remove("sent")
            }
        }
    }

    componentWillUnmount() {
        // if (this.intersectionObserver) {
        //     this.intersectionObserver.unobserve(this.$el)
        // }
    }
}

export default GeneralMessageComponent