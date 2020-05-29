import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
import type {Message} from "../../../../../../Api/Messages/Message"
import {ReplyFragment} from "./ReplyFragment"
import {ForwardedHeaderFragment} from "./ForwardedHeaderFragment"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import __component_destroy from "../../../../../../V/VRDOM/component/__component_destroy"
import StatefulComponent from "../../../../../../V/VRDOM/component/StatefulComponent"

class GeneralMessageComponent extends StatefulComponent {
    message: Message

    avatarRef = VComponent.createComponentRef()
    bubbleRef = VComponent.createRef()

    constructor(props) {
        super(props)

        this.message = this.props.message
    }

    appEvents(E) {
        E.bus(AppEvents.General)
            .filter(event => event.message && event.message.id === this.message.id)
            .on("messages.deleted", this.onMessageDeleted)
            .on("messages.edited", this.onMessageEdited)

        E.bus(AppEvents.General)
            .filter(event => event.message && event.message.dialogPeer === this.message.dialogPeer)
            .on("messages.read", this.onMessagesRead)


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

    componentDidMount() {
        this.message.show()
    }

    componentWillUpdate(nextProps, nextState) {
        this.message = nextProps.message
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
        this.forceUpdate()
    }

    messageOnReplyNotFound = () => {
        this.forceUpdate()
    }

    messageOnForwardedFound = () => {
        this.forceUpdate()
    }

    messageOnEdit = event => {
        if (event.message === this.message) {
            this.message.show()
            this.forceUpdate()
        }
    }

    messageOnDelete = () => {
        __component_destroy(this)
    }

    messageOnRead = () => {
        if (this.bubbleRef.$el) {
            if (this.message.isRead && !this.bubbleRef.$el.classList.contains("read")) {
                this.bubbleRef.$el.classList.add("read")
                this.bubbleRef.$el.classList.remove("sent")
            }
        }
    }
}

export default GeneralMessageComponent