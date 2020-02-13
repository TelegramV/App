import VComponent from "../../../../../v/vrdom/component/VComponent"
import {ContactFragment} from "../../../components/basic/ContactFragment"
import DialogsStore from "../../../../../../api/store/DialogsStore"
import {UserPeer} from "../../../../../../api/peers/objects/UserPeer"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {BotPeer} from "../../../../../../api/peers/objects/BotPeer"

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

    h() {
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

    mounted() {
        this.refreshRecent()
    }

    getRecent = () => {
        return DialogsStore.toSortedArray()
            .filter(dialog => dialog.peer instanceof UserPeer && !(dialog.peer instanceof BotPeer) && !dialog.peer.isSelf && dialog.peer.id !== 777000)
            .slice(0, 6)
            .map(dialog => dialog.peer)
    }

    refreshRecent = () => {
        this.state.peers = this.getRecent()
    }

    onPeersUpdate = event => {
        if (this.state.peers.indexOf(event.peer) > -1) {
            this.__patch()
        }
    }
}