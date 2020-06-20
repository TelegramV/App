import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
import type {Message} from "../../../../../../Api/Messages/Message"
import StatefulComponent from "../../../../../../V/VRDOM/component/StatefulComponent"
import {isGrouping, isSameDate} from "../../messagesUtils"
import {isElementInViewport} from "../../../../../Utils/isElementInViewport"

type Props = {
    message: Message;
    observer: IntersectionObserver;
}

class GeneralMessageComponent extends StatefulComponent<Props> {
    appEvents(E) {
        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.message.dialogPeer)
            .on("messages.deleted", this.onMessagesDeleted)
            .on("messages.readOut", this.onMessagesReadOut)
    }

    reactive(R) {
        R.object(this.props.message)
            .updateOn("edited")
            .updateOn("replyFound")
            .updateOn("forwardedFound")
    }

    componentWillMount(props) {

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

    onMessagesReadOut = ({maxId, prevMaxId}) => {
        const id = this.props.message.id

        if (id <= maxId && id > prevMaxId) {
            this.forceUpdate()
        }
    }

    onElementVisible() {
        if (!this.props.message.isInRead && isElementInViewport(document.getElementById("bubbles-inner"), this.$el)) {
            this.props.message.dialogPeer.api.readHistory(this.props.message.id)
        }
    }

    onElementHidden() {
        // console.log("hidden", this)
    }

    domSiblingUpdated(prevMessage, nextMessage) {
        const message = this.props.message;
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

        this.state.showDate = !isSameDate(message.date, prevMessage?.date)

        this.forceUpdate();
    }


    onMessagesDeleted = (event: BusEvent) => {
        if (event.messages.indexOf(this.props.message.id) > -1) {
            this.forceUpdate();
        }
    }
}

export default GeneralMessageComponent