import {ContactFragment} from "../../../basic/ContactFragment"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../../../EventBus/UIEvents"
import SearchManager from "../../../../../../Api/Search/SearchManager"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import AppSelectedPeer from "../../../../../Reactive/SelectedPeer"
import List from "../../../../../../V/VRDOM/list/List"
import VArray from "../../../../../../V/VRDOM/list/VArray"
import {highlightVRNodeWord} from "../../../../../Utils/highlightVRNodeText"

let currentQuery = undefined

class ContactComponent extends VComponent {

    init() {
        this.loadFullIfNeeded()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.loadFullIfNeeded()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.peer !== nextProps.peer
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updatePhoto", this.onPeerUpdate)
            .on("updatePhotoSmall", this.onPeerUpdate)
            .on("updateUserStatus", this.onPeerUpdate)
            .on("fullLoaded", this.onPeerUpdate)
    }

    render() {
        return <ContactFragment url={this.props.peer.photo.smallUrl}
                                name={highlightVRNodeWord(this.props.peer.name, currentQuery)}
                                status={this.props.peer.statusString.text}
                                onClick={() => AppSelectedPeer.select(this.props.peer)}
                                peer={this.props.peer}/>
    }

    loadFullIfNeeded = () => {
        if (this.props.peer.type !== "user" && !this.props.peer.full) {
            this.props.peer.fetchFull()
        }
    }

    onPeerUpdate = event => {
        if (event.peer === this.props.peer) {
            this.forceUpdate()
        }
    }
}

const ContactFragmentItemTemplate = (peer) => {
    return <ContactComponent peer={peer}/>
}

export class GlobalChatsSearchComponent extends VComponent {

    state = {
        peers: new VArray(),
        myPeers: new VArray(),
        messages: new VArray(),
    }

    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)

        E.bus(AppEvents.Peers)
            .on("updatePhotoSmall", this.onPeersUpdate)
            .on("updatePhoto", this.onPeersUpdate)
            .on("updateUserStatus", this.onPeersUpdate)
            .on("fullLoaded", this.onPeersUpdate)
    }

    render() {
        return (
            <div>
                <div className="contacts-and-chats section">
                    <div className="section-title">Contacts and Chats</div>
                    <List list={this.state.myPeers}
                          template={ContactFragmentItemTemplate}
                          wrapper={<div className="column-list"/>}/>
                </div>
                <div className="global-chats section">
                    <div className="section-title">Global search</div>
                    <List list={this.state.peers}
                          template={ContactFragmentItemTemplate}
                          wrapper={<div className="column-list"/>}/>
                </div>
            </div>
        )
    }

    onPeersUpdate = event => {
        // if (this.state.peers.indexOf(event.peer) > -1 || this.state.myPeers.indexOf(event.peer) > -1) {
        //     // very dirty thing, but fuck, we have no time
        //     this.forceUpdate()
        // }
    }

    onSearchInputUpdated = event => {
        const q = event.string.trim()

        if (q !== "" && q !== currentQuery) {
            currentQuery = q

            SearchManager.searchContactsByUsername(q, 100).then(Found => {
                if (Found.__q === currentQuery) {
                    // this.state.myPeers.set(Found.myPeers)
                    // this.state.peers.set(Found.peers)
                    this.setState({
                        peers: new VArray(Found.peers),
                        myPeers: new VArray(Found.myPeers),
                    })
                }
            })
        }
    }
}