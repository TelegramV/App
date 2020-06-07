import AppConnectionStatus from "../../../../Reactive/ConnectionStatus"
import UIEvents from "../../../../EventBus/UIEvents"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

class ConnectionStatusComponent extends StatelessComponent {

    appEvents(E) {
        E.bus(UIEvents.General)
            .on("connection")
    }

    render() {
        if (AppConnectionStatus.Status === AppConnectionStatus.OK) {
            return <div/>
        }

        let statusString = "Connecting"

        if (AppConnectionStatus.Status === AppConnectionStatus.WAITING_FOR_NETWORK) {
            statusString = "Waiting for network"
        } else if (AppConnectionStatus.Status === AppConnectionStatus.FETCHING_DIFFERENCE) {
            statusString = "Fetching updates"
        } else if (AppConnectionStatus.Status === AppConnectionStatus.CONNECTING) {
            statusString = "Connecting"
        }

        return (
            <div className="connecting"
                 id="connecting_message">
                <progress className="progress-circular"/>
                <span className="loading-text">{statusString}</span>
            </div>
        )
    }
}

export default ConnectionStatusComponent