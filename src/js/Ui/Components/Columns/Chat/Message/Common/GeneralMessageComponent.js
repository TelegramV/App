import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
import type {Message} from "../../../../../../Api/Messages/Message"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import __component_destroy from "../../../../../../V/VRDOM/component/__component_destroy"
import StatefulComponent from "../../../../../../V/VRDOM/component/StatefulComponent"

class GeneralMessageComponent extends StatefulComponent {
    message: Message

    // NEVER USE STATE HERE

    avatarRef = VComponent.createComponentRef()
    bubbleRef = VComponent.createRef()

    appEvents(E) {
        E.bus(AppEvents.General)
            .filter(event => event.message && event.message.id === this.props.message.id)
            .on("messages.deleted", this.onMessageDeleted)
            .on("messages.edited", this.onMessageEdited)

        E.bus(AppEvents.General)
            .filter(event => event.message && event.message.dialogPeer === this.props.message.dialogPeer)
            .on("messages.read", this.onMessagesRead)


        E.bus(AppEvents.Dialogs)
            .on("deleteMessages", this.onMessagesDeleteEvent)
            .on("deleteChannelMessages", this.onMessagesDeleteEvent)
            .on("editMessage", this.messageOnEdit)
            .on("updateReadOutboxMaxId", this.onReadOutboxMaxId)
    }

    reactive(R) {
        R.object(this.props.message)
            .on("edit", this.messageOnEdit)
            .on("replyToMessageFound", this.messageOnReplyFound)
            .on("replyToMessageNotFound", this.messageOnReplyNotFound)
            .on("forwardedNameOnlyFound", this.messageOnForwardedFound)
            .on("forwardedChannelFound", this.messageOnForwardedFound)
    }

    componentDidMount() {
        this.props.message.show()

        if (this.props.observer) {
            this.props.observer.observe(this.$el)
        }
    }

    componentWillUnmount() {
        if (this.props.observer) {
            this.props.observer.unobserve(this.$el)
        }
    }

    onMessagesDeleteEvent = (event: BusEvent) => {
        if (event.messages.indexOf(this.props.message.id) > -1) {
            this.messageOnDelete()
        }
    }

    onReadOutboxMaxId = (event: BusEvent) => {
        if (this.props.message.id <= this.props.message.to.messages.readOutboxMaxId && this.props.message.isOut) {
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
        if (event.message === this.props.message) {
            this.props.message.show()
            this.forceUpdate()
        }
    }

    messageOnDelete = () => {
        __component_destroy(this)
    }

    messageOnRead = () => {
        if (this.bubbleRef.$el) {
            if (this.props.message.isRead && !this.bubbleRef.$el.classList.contains("read")) {
                this.bubbleRef.$el.classList.add("read")
                this.bubbleRef.$el.classList.remove("sent")
            }
        }
    }
}

export default GeneralMessageComponent