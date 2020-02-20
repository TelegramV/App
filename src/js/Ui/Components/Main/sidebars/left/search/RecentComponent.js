import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import {ContactFragment} from "../../../basic/ContactFragment"
import DialogsStore from "../../../../../../Api/Store/DialogsStore"
import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import AppSelectedPeer from "../../../../../Reactive/SelectedPeer"
import {BotPeer} from "../../../../../../Api/Peers/Objects/BotPeer"

export class RecentComponent extends VComponent {

    state = {
        peers: []
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updateUserStatus", this.onPeersUpdate)
            .on("updatePhoto", this.onPeersUpdate)
            .on("updatePhotoSmall", this.onPeersUpdate)
    }

    render() {
        return (
            <div className="recent section">
                <div className="section-title">Recent</div>
                <div className="column-list">
                    {
                        this.state.peers.map(peer => {
                            return <ContactFragment url={peer.photo.smallUrl}
                                                    name={peer.name}
                                                    status={peer.statusString.text}
                                                    peer={peer}
                                                    onClick={() => AppSelectedPeer.select(peer)}/>
                        })
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.refreshRecent()
    }

    getRecent = () => {
        return DialogsStore.toSortedArray()
            .filter(dialog => dialog.peer instanceof UserPeer && !(dialog.peer instanceof BotPeer) && !dialog.peer.isSelf && dialog.peer.id !== 777000)
            .slice(0, 6)
            .map(dialog => dialog.peer)
    }

    refreshRecent = () => {
        this.setState({
            peers: this.getRecent()
        })
    }

    onPeersUpdate = event => {
        if (this.state.peers.indexOf(event.peer) > -1) {
            this.forceUpdate()
        }
    }
}