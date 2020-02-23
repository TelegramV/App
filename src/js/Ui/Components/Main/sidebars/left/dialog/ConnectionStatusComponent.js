import AppConnectionStatus from "../../../../../Reactive/ConnectionStatus"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"

export class ConnectionStatusComponent extends VComponent {

    callbacks = {
        status: AppConnectionStatus.Reactive.PatchOnly
    }

    render() {
        let statusString = "Connecting..."

        if (this.callbacks.status === AppConnectionStatus.WAITING_FOR_NETTWORK) {
            statusString = "Waiting for network..."
        } else if (this.callbacks.status === AppConnectionStatus.FETCHING_DIFFERENCE) {
            statusString = "Fetching updates..."
        }

        return (
            <div css-display={this.callbacks.status === AppConnectionStatus.OK ? "none" : "flex"}
                 className="connecting"
                 id="connecting_message">
                <progress className="progress-circular"/>
                <span>{statusString}</span>
            </div>
        )
    }
}