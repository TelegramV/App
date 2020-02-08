import VComponent from "../../../../../v/vrdom/component/VComponent"
import UIEvents from "../../../../../eventBus/UIEvents"
import SearchManager from "../../../../../../api/search/SearchManager"
import {ContactFragment} from "./ContactFragment"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import PeersStore from "../../../../../../api/store/PeersStore"

export class GlobalMessagesSearchComponent extends VComponent {

    currentQuery = undefined

    froms: []

    state = {
        messages: [],
    }

    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)

        E.bus(AppEvents.Peers)
            .on("updatePhotoSmall", this.onPeersPhoto)
            .on("updatePhoto", this.onPeersPhoto)
    }

    h() {
        return (
            <div className="global-messages">
                <div className="section-title">Global search</div>
                <div className="column-list">
                    {
                        this.state.messages.filter(m => m.to && m.from).map(m => {
                            const peer = m.to === PeersStore.self() ? m.from : m.to

                            this.froms.push(peer)

                            return <ContactFragment url={peer.photo.smallUrl}
                                                    name={peer.name}
                                                    status={m.prefix + m.text}
                                                    peer={peer}/>
                        })
                    }
                </div>
            </div>
        )
    }

    onPeersPhoto = event => {
        if (this.froms && this.froms.indexOf(event.peer) > -1) {
            // very dirty thing, but fuck, we have no time
            this.__patch()
        }
    }

    onSearchInputUpdated = event => {
        const q = event.string.trim()

        if (q !== "" && q !== this.currentQuery) {
            this.currentQuery = q

            SearchManager.globalSearch(q, {limit: 20}).then(Messages => {
                if (Messages.__q === this.currentQuery) {
                    this.froms = []
                    this.state.messages = Messages.messages
                }
            })
        }
    }
}