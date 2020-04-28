import {RightBarComponent} from "../RightBarComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import VTagsInput from "../../../../Elements/Input/VTagsInput"
import AvatarComponent from "../../../Basic/AvatarComponent"
import PeersStore from "../../../../../Api/Store/PeersStore"

class ForwardBarComponent extends RightBarComponent {

    barName = "forward-message"
    barVisible = false

    offsetId = 0
    allFetched = false
    isFetching = false

    appEvents(E) {
        super.appEvents(E)

        E.bus(UIEvents.General)
            .on("message.forward", this.onForwardMessage)

        // E.bus(UIEvents.General)
        //     .on("chat.select", this.onChatSelect)
    }

    render() {
        return (
            <div class="sidebar right scrollable forward-bar hidden" onScroll={this.onScroll}>
                <div class="sidebar-header no-borders">
                    <span className="btn-icon tgico tgico-close rp rps" onClick={_ => this.hideBar()}/>
                    <div className="sidebar-title">Forward</div>
                </div>
                <div className="peers">
                    <VTagsInput tags={[
                        <span className="tag">
                        <AvatarComponent peer={PeersStore.self()}/>
                        <span>Максим</span>
                    </span>,
                        <span className="tag">
                        <AvatarComponent peer={PeersStore.self()}/>
                        <span>Денис</span>
                    </span>,
                        <span className="tag">
                        <AvatarComponent peer={PeersStore.self()}/>
                        <span>Єва</span>
                    </span>,
                    ]}/>
                </div>
            </div>
        )
    }

    onForwardMessage = _ => {
        this.openBar()
    }

    onChatSelect = _ => {
        // this.hideBar()
    }

    onScroll = event => {
    }
}

export default ForwardBarComponent