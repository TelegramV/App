import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../../../EventBus/UIEvents"
import SearchManager from "../../../../../../Api/Search/SearchManager"
import {ContactFragment} from "../../../basic/ContactFragment"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import PeersStore from "../../../../../../Api/Store/PeersStore"
import {highlightVRNodeWord} from "../../../../../Utils/highlightVRNodeText"

const MessageFragment = ({m, peers, q}) => {
    const peer = m.to === PeersStore.self() ? m.from : m.to

    peers.push(peer)

    return <ContactFragment url={peer.photo.smallUrl}
                            name={peer.name}
                            status={<span>{m.prefix}{highlightVRNodeWord(m.text, q)}</span>}
                            time={m.getFormattedDate()}
                            peer={peer}
                            onClick={() => {
                                UIEvents.Bubbles.fire("showMessageInstant", m)

                            }}/>
}

export class GlobalMessagesSearchComponent extends VComponent {

    currentQuery = undefined
    offsetRate = 0
    allFetched = false
    isFetching = false

    peers: []

    state = {
        messages: [],
    }

    messagesListRef = VComponent.createRef()

    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)
            .on("searchInputNextPage", this.onSearchBarNextPage)

        E.bus(AppEvents.Peers)
            .on("updatePhotoSmall", this.onPeersPhoto)
            .on("updatePhoto", this.onPeersPhoto)
    }

    render() {
        let list = this.state.messages
            .filter(m => m.to && m.from)
            .map(m => <MessageFragment m={m}
                                       peers={this.peers}
                                       q={this.currentQuery}/>);
        return (
            <div className="global-messages section">
                <div className="section-title">Global search</div>
                <div className="column-list" ref={this.messagesListRef}>
                    {list}
                </div>
            </div>
        )
    }

    onPeersPhoto = event => {
        if (this.peers && this.peers.indexOf(event.peer) > -1) {
            // very dirty thing, but fuck, we have no time
            this.forceUpdate()
        }
    }

    onSearchBarNextPage = _ => {
        if (!this.isFetching && this.currentQuery !== "" && !this.allFetched && this.offsetRate) {
            this.isFetching = true

            SearchManager.globalSearch(this.currentQuery, {limit: 20, offsetRate: this.offsetRate}).then(Messages => {
                if (Messages.__q === this.currentQuery) {
                    Messages.messages.shift()

                    this.state.messages.push(...Messages.messages)
                    this.offsetRate = Messages.next_rate

                    Messages.messages.forEach(m => VRDOM.append(<MessageFragment m={m}
                                                                                 peers={this.peers}
                                                                                 q={this.currentQuery}/>, this.messagesListRef.$el))

                    this.isFetching = false

                    if (Messages._ === "messages" || Messages.count < 20) {
                        this.offsetRate = 0
                        this.allFetched = true
                    }
                }
            })
        }
    }

    onSearchInputUpdated = event => {
        const q = event.string.trim()

        if (q !== "" && q !== this.currentQuery) {
            this.currentQuery = q
            this.offsetRate = 0
            this.allFetched = false
            this.isFetching = true

            if (!this.allFetched) {
                SearchManager.globalSearch(q, {limit: 20, offsetRate: this.offsetRate}).then(Messages => {
                    if (Messages.__q === this.currentQuery) {
                        this.peers = []
                        this.setState({
                            messages: Messages.messages
                        })
                        this.offsetRate = Messages.next_rate

                        this.isFetching = false

                        if (Messages._ === "messages" || Messages.count < 20) {
                            this.offsetRate = 0
                            this.allFetched = true
                        }
                    }
                })
            }
        }
    }
}