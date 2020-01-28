import Component from "../../../../v/vrdom/Component"
import AppConnectionStatus from "../../../../reactive/ConnectionStatus"

export class ConnectionStatusComponent extends Component {
    constructor(props) {
        super(props)

        this.reactive = {
            status: AppConnectionStatus.Reactive.PatchOnly
        }
    }

    h() {
        let statusString = "Connecting..."

        if (this.reactive.status === AppConnectionStatus.WAITING_FOR_NETTWORK) {
            statusString = "Waiting for network..."
        } else if (this.reactive.status === AppConnectionStatus.FETCHING_DIFFERENCE) {
            statusString = "Fetching updates..."
        }

        return (
            <div css-display={this.reactive.status === AppConnectionStatus.OK ? "none" : "flex"}
                 className="connecting"
                 id="connecting_message">
                <progress className="progress-circular"/>
                <span>{statusString}</span>
            </div>
        )
    }
}