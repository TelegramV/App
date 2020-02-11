import {ContactFragment} from "../../../components/basic/ContactFragment"
import VComponent from "../../../../../v/vrdom/component/VComponent"
import UIEvents from "../../../../../eventBus/UIEvents"
import SearchManager from "../../../../../../api/search/SearchManager"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"

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

    h() {
        return (
            <div>
                <div className="contacts-and-chats">
                    <div className="section-title">Contacts and Chats</div>
                    <div className="column-list"> {
                        this.state.myPeers.map(p => {
                            if (p.type !== "user" && !p.full) {
                                p.fetchFull()
                            }
                            return <ContactFragment url={p.photo.smallUrl}
                                                    name={p.name}
                                                    status={p.statusString.text}
                                                    onClick={() => AppSelectedPeer.select(p)}/>
                        })
                    }
                    </div>
                </div>
                <div className="global-chats">
                    <div className="section-title">Global search</div>
                    <div className="column-list">
                        {
                            this.state.peers.map(p => <ContactFragment url={p.photo.smallUrl}
                                                                       name={p.name}
                                                                       status={p.username ? `@${p.username}` : ``}
                                                                       onClick={() => AppSelectedPeer.select(p)}/>)
                        }
                    </div>
                </div>
            </div>
        )
    }

    onPeersUpdate = event => {
        if (this.state.peers.indexOf(event.peer) > -1 || this.state.myPeers.indexOf(event.peer) > -1) {
            // very dirty thing, but fuck, we have no time
            this.__patch()
        }
    }

    onSearchInputUpdated = event => {
        const q = event.string.trim()

        if (q !== "" && q !== this.currentQuery) {
            this.currentQuery = q

            SearchManager.searchContactsByUsername(q, 100).then(Found => {
                console.log(Found)
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