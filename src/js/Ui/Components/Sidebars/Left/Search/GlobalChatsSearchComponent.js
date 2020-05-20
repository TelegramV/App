import UIEvents from "../../../../EventBus/UIEvents"
import SearchManager from "../../../../../Api/Search/SearchManager"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import List from "../../../../../V/VRDOM/list/List"
import VArray from "../../../../../V/VRDOM/list/VArray"
import {highlightVRNodeWord} from "../../../../Utils/highlightVRNodeText"
import ContactComponent from "../../../Basic/ContactComponent"
import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"

let CURRENT_QUERY = undefined

const ContactFragmentItemTemplate = (peer) => {
    return <ContactComponent peer={peer}
                             fetchFull={true}
                             name={highlightVRNodeWord(peer.name, CURRENT_QUERY)}
                             status={() => peer.statusString.text}
                             onClick={() => AppSelectedChat.select(peer)}/>
}

const SectionTitleFragment = ({title}) => {
    return <div className="section-title">{title}</div>
}

export class GlobalChatsSearchComponent extends StatefulComponent {
    state = {
        peers: new VArray(),
        myPeers: new VArray(),
        isSearching: true,
    }

    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)
    }

    render() {
        return (
            <div>
                <div className="contacts-and-chats section"
                     css-display={this.state.myPeers.size() === 0 && !this.state.isSearching ? "none" : undefined}>
                    <SectionTitleFragment title={this.state.isSearching ? "Searching..." : "Contacts and Chats"}/>
                    <List list={this.state.myPeers}
                          template={ContactFragmentItemTemplate}
                          wrapper={<div className="column-list"/>}/>
                </div>
                <div className="global-chats section" css-display={this.state.peers.size() === 0 && !this.state.isSearching ? "none" : undefined}>
                    <SectionTitleFragment title={this.state.isSearching ? "Searching..." : "Global search"}/>
                    <List list={this.state.peers}
                          template={ContactFragmentItemTemplate}
                          wrapper={<div className="column-list"/>}/>
                </div>
            </div>
        )
    }

    onSearchInputUpdated = event => {
        const q = event.string.trim()

        if (q !== "" && q !== CURRENT_QUERY) {
            CURRENT_QUERY = q

            this.setState({
                isSearching: true
            })

            SearchManager.searchContactsByUsername(q, 100).then(Found => {
                if (Found.__q === CURRENT_QUERY) {
                    this.setState({
                        isSearching: false
                    })

                    this.state.myPeers.set(Found.myPeers)
                    this.state.peers.set(Found.peers)

                    this.forceUpdate()
                }
            })
        }
    }
}