import Component from "../../../../../v/vrdom/component"
import AppEvents from "../../../../../../api/eventBus/AppEvents"

class GeneralMessageComponent extends Component {

    constructor(props) {
        super(props)

        /**
         * @type {Message}
         */
        this.message = this.props.message

        this.prevReadStatus = this.message.isRead

        this.appEvents.add(AppEvents.Dialogs.reactiveAnySingle(this.props.message.dialog).FireOnly)
    }

    /**
     *
     * @param bus
     * @param event
     * @return {boolean}
     */
    eventFired(bus, event) {
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