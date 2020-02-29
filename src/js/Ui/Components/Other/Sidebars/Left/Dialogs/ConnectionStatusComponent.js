import AppConnectionStatus from "../../../../../Reactive/ConnectionStatus"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../../../EventBus/UIEvents"

class ConnectionStatusComponent extends VComponent {

    appEvents(E) {
        E.bus(UIEvents.General)
            .on("connection")
    }

    render() {
        let statusString = "Connecting..."

        if (AppConnectionStatus.Status === AppConnectionStatus.WAITING_FOR_NETTWORK) {
            statusString = "Waiting for network..."
        } else if (AppConnectionStatus.Status === AppConnectionStatus.FETCHING_DIFFERENCE) {
            statusString = "Fetching updates..."
        }

        return (
            <div css-display={AppConnectionStatus.Status === AppConnectionStatus.OK ? "none" : "flex"}
                 className="connecting"
                 id="connecting_message">
                <progress className="progress-circular"/>
                <span>{statusString}</span>
            </div>
        )
    }
}

export default ConnectionStatusComponent