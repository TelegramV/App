import {RightBarComponent} from "../RightBarComponent"
import {ContactFragment} from "../../../components/basic/ContactFragment"
import VComponent from "../../../../../v/vrdom/component/VComponent"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import SearchManager from "../../../../../../api/search/SearchManager"
import {LazyInput} from "../../../../../components/LazyInput"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {SearchMessage} from "../../../../../../api/messages/SearchMessage"
import UIEvents from "../../../../../eventBus/UIEvents"
import {highlightVRNodeWord} from "../../../../../utils/highlightVRNodeText"

const MessageFragment = ({m, peers, onClick, q}) => {
    const peer = m.from

    peers.push(peer)

    return <ContactFragment url={peer.photo.smallUrl}
                            name={peer.name}
                            status={highlightVRNodeWord(m.text, q)}
                            peer={peer}
                            time={m.getFormattedDate()}
                            onClick={onClick}/>
}

const MessagesListFragment = ({messages, peers, q}) => {
    return (
        <div className="column-list">
            {
                messages
                    .filter(m => m.to && m.from)
                    .map(m => <MessageFragment m={m} peers={peers} onClick={() => {
                        UIEvents.Bubbles.fire("showMessageInstant", m)
                    }} q={q}/>)
            }
        </div>
    )
}

const MessagesCountFragment = ({count}) => {
    return <div className="section-title">{count} messages found</div>
}

export default class MessageSearchComponent extends RightBarComponent {

    useProxyState = false

    barName = "messages-search"
    barVisible = false

    messagesListRef = VComponent.createFragmentRef()
    messagesCountRef = VComponent.createFragmentRef()
    inputRef = VComponent.createComponentRef()

    currentQuery = undefined
    offsetId = 0
    allFetched = false
    isFetching = false

    state = {
        messages: [],
        peers: [],
        messagesCount: 0
    }

    callbacks = {
        peer: AppSelectedPeer.Reactive.FireOnly
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(UIEvents.RightSidebar)
            .on("setSearchQuery", this.onSetSearchQuery)

        E.bus(AppEvents.Peers)
            .on("updatePhotoSmall", this.onPeersPhoto)
            .on("updatePhoto", this.onPeersPhoto)
    }

    h() {
        return (
            <div class="sidebar right scrollable hidden messages-search search-results" onScroll={this.onScroll}>
                <div class="toolbar">
                    <span class="btn-icon tgico tgico-close rp rps" onClick={_ => this.openBar("no")}/>
                    <div class="search">
                        <div class="input-search">
                            <LazyInput ref={this.inputRef}
                                       type="text"
                                       placeholder="Search"
                                       onInput={this.onSearchInputUpdated}
                                       lazyLevel={500}/>
                            <span class="tgico tgico-search"/>
                        </div>
                    </div>
                </div>
                <div class="global-messages">
                    <MessagesCountFragment ref={this.messagesCountRef} count={this.state.messagesCount}/>
                    <MessagesListFragment ref={this.messagesListRef} messages={this.state.messages} peers={this.peers}
                                          q={this.currentQuery}/>
                </div>
            </div>
        )
    }

    onPeersPhoto = event => {
        if (this.peers && this.peers.indexOf(event.peer) > -1) {
            this.patchResult({})
        }
    }

    patchResult = ({messages, peers, count}) => {
        this.messagesCountRef.patch({count: count || this.state.messagesCount})
        this.messagesListRef.patch({
            messages: messages || this.state.messages,
            peers: peers || this.state.peers,
            q: this.currentQuery
        })
    }

    onSearchNextPage = _ => {
        if (!this.isFetching && this.currentQuery !== "" && !this.allFetched && this.offsetId) {
            this.isFetching = true

            SearchManager.searchMessages(AppSelectedPeer.Current, {
                q: this.currentQuery,
                limit: 20,
                offsetId: this.offsetId
            }).then(Messages => {
                if (Messages.__q === this.currentQuery) {
                    this.state.messages.push(...Messages.messages)

                    if (Messages.current_count > 0) {
                        this.offsetId = Messages.messages[Messages.messages.length - 1].id
                    }

                    Messages.messages
                        .map(m => new SearchMessage(AppSelectedPeer.Current).fillRaw(m))
                        .forEach(m => VRDOM.append(<MessageFragment m={m}
                                                                    peers={this.state.peers}
                                                                    q={this.currentQuery} onClick={() => {
                            UIEvents.Bubbles.fire("showMessageInstant", m)
                        }}/>, this.messagesListRef.$el))

                    this.isFetching = false

                    if (Messages._ === "messages" || Messages.current_count < 20) {
                        this.offsetId = 0
                        this.allFetched = true
                    }
                }
            })
        }
    }

    onSearchInputUpdated = event => {
        const q = event.target.value.trim()

        if (q === "") {
            this.state.messagesCount = 0
            this.state.messages = []
            this.patchResult({
                count: 0
            })
            return
        }

        if (q !== this.currentQuery) {
            this.currentQuery = q
            this.offsetId = 0
            this.allFetched = false
            this.isFetching = true

            if (!this.allFetched) {
                SearchManager.searchMessages(AppSelectedPeer.Current, {
                    q,
                    limit: 20,
                    offsetId: this.offsetId
                }).then(Messages => {
                    if (Messages.__q === this.currentQuery) {
                        this.peers = []

                        this.state.messages = Messages.messages.map(m => new SearchMessage(AppSelectedPeer.Current).fillRaw(m))
                        this.state.messagesCount = Messages.count || Messages.current_count

                        this.patchResult({
                            messages: this.state.messages,
                            peers: this.peers,
                            count: this.state.messagesCount
                        })

                        if (Messages.current_count > 0) {
                            this.offsetId = Messages.messages[Messages.messages.length - 1].id
                        }

                        if (Messages._ === "messages" || Messages.current_count < 20) {
                            this.offsetId = 0
                            this.allFetched = true
                        }

                        this.isFetching = false
                    }
                })
            }
        }
    }

    callbackChanged(key: string, value: *) {
        if (key === "peer") {
            this.currentQuery = undefined
            this.offsetId = 0
            this.allFetched = false
            this.isFetching = true

            this.inputRef.component.$el.value = ""

            this.state.messages = []
            this.peers = []
            this.state.messagesCount = 0
            this.patchResult({})
            this.hideBar()
        }
    }

    onSetSearchQuery = event => {
        this.inputRef.component.$el.value = event.q

        this.onSearchInputUpdated({
            target: {
                value: event.q
            }
        })

        this.openBar()
    }

    onScroll = event => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop) {
            this.onSearchNextPage()
        }
    }
}