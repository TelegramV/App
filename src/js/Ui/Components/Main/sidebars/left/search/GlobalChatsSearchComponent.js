import {ContactFragment} from "../../../basic/ContactFragment"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../../../EventBus/UIEvents"
import SearchManager from "../../../../../../Api/Search/SearchManager"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import AppSelectedPeer from "../../../../../Reactive/SelectedPeer"
import {highlightVRNodeWord} from "../../../../../Utils/highlightVRNodeText"

export class GlobalChatsSearchComponent extends VComponent {

    currentQuery = undefined

    state = {
        peers: [],
        myPeers: [],
        messages: []
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
                    <div className="column-list"> {
                        this.state.myPeers.map(p => {
                            if (p.type !== "user" && !p.full) {
                                p.fetchFull()
                            }
                            return <ContactFragment url={p.photo.smallUrl}
                                                    name={highlightVRNodeWord(p.name, this.currentQuery)}
                                                    status={p.statusString.text}
                                                    onClick={() => AppSelectedPeer.select(p)}
                                                    peer={p}/>
                        })
                    }
                    </div>
                </div>
                <div className="global-chats section">
                    <div className="section-title">Global search</div>
                    <div className="column-list">
                        {
                            this.state.peers.map(p => <ContactFragment url={p.photo.smallUrl}
                                                                       name={highlightVRNodeWord(p.name, this.currentQuery)}
                                                                       status={highlightVRNodeWord(p.username ? `@${p.username}` : ``, this.currentQuery)}
                                                                       onClick={() => AppSelectedPeer.select(p)}
                                                                       peer={p}/>)
                        }
                    </div>
                </div>
            </div>
        )
    }

    onPeersUpdate = event => {
        if (this.state.peers.indexOf(event.peer) > -1 || this.state.myPeers.indexOf(event.peer) > -1) {
            // very dirty thing, but fuck, we have no time
            this.forceUpdate()
        }
    }

    onSearchInputUpdated = event => {
        const q = event.string.trim()

        if (q !== "" && q !== this.currentQuery) {
            this.currentQuery = q

            SearchManager.searchContactsByUsername(q, 100).then(Found => {
                if (Found.__q === this.currentQuery) {
                    this.setState({
                        peers: Found.peers,
                        myPeers: Found.myPeers,
                    })
                }
            })
        }
    }
}