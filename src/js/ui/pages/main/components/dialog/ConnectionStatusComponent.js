import Component from "../../../../framework/vrdom/component"
import AppConnectionStatus from "../../../../reactive/connectionStatus"

export class ConnectionStatusComponent extends Component {
    constructor(props) {
        super(props)

        this.reactive = {
            status: AppConnectionStatus.Reactive.PatchOnly
        }
    }

    h() {
        let statusString = "Waiting for network..."

        if (this.reactive.status === AppConnectionStatus.FETCHING_DIFFERENCE) {
            statusString = "Fetching updates..."
        }

        return (
            <div css-display={this.reactive.status === AppConnectionStatus.OK ? "none" : "flex"} className="connecting"
                 id="connecting_message">
                <progress className="progress-circular"/>
                <span>{statusString}</span>
            </div>
        )
    }
}