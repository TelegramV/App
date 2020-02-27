import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import {ContactFragment} from "../../../basic/ContactFragment"
import DialogsStore from "../../../../../../Api/Store/DialogsStore"
import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import AppSelectedPeer from "../../../../../Reactive/SelectedPeer"
import {BotPeer} from "../../../../../../Api/Peers/Objects/BotPeer"
import ContactComponent from "../../../basic/ContactComponent"
import List from "../../../../../../V/VRDOM/list/List"
import VArray from "../../../../../../V/VRDOM/list/VArray"

const ContactFragmentItemTemplate = (peer) => {
    return <ContactComponent peer={peer}
                             fetchFull={true}
                             name={peer.name}
                             status={() => peer.statusString.text}
                             onClick={() => AppSelectedPeer.select(peer)}/>
}

export class RecentComponent extends VComponent {

    state = {
        peers: new VArray()
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .constraint(event => this.state.peers.items.indexOf(event.peer) > -1)
            .on("updateUserStatus")
            .on("updatePhoto")
            .on("updatePhotoSmall")
    }

    componentDidMount() {
        this.refreshRecent()
    }

    render() {
        return (
            <div className="recent section">
                <div className="section-title">Recent</div>
                <List list={this.state.peers}
                      template={ContactFragmentItemTemplate}
                      wrapper={<div className="column-list"/>}/>
            </div>
        )
    }

    getRecent = () => {
        return DialogsStore.toSortedArray()
            .filter(dialog => dialog.peer instanceof UserPeer && !(dialog.peer instanceof BotPeer) && !dialog.peer.isSelf && dialog.peer.id !== 777000)
            .slice(0, 6)
            .map(dialog => dialog.peer)
    }

    refreshRecent = () => {
        this.state.peers.set(this.getRecent())
    }
}