import {RightBarComponent} from "../RightBarComponent"
import {ContactFragment} from "../../../components/basic/ContactFragment"
import VComponent from "../../../../../v/vrdom/component/VComponent"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import SearchManager from "../../../../../../api/search/SearchManager"
import {LazyInput} from "../../../../../components/LazyInput"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {SearchMessage} from "../../../../../../api/messages/SearchMessage"

const MessageFragment = ({m, peers}) => {
    const peer = m.from

    peers.push(peer)

    return <ContactFragment url={peer.photo.smallUrl}
                            name={peer.name}
                            status={m.text}
                            peer={peer}
                            time={m.getDate('en', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })}
                            onClick={() => console.log("not implemented")}/>
}

const MessagesListFragment = ({messages, peers}) => {
    return (
        <div className="column-list">
            {
                messages
                    .filter(m => m.to && m.from)
                    .map(m => <MessageFragment m={m} peers={peers}/>)
            }
        </div>
    )
}

export default class MessageSearchComponent extends RightBarComponent {

    useProxyState = false

    barName = "messages-search"
    barVisible = false

    messagesListRef = VComponent.createFragmentRef()
    inputRef = VComponent.createComponentRef()

    currentQuery = undefined
    offsetId = 0
    allFetched = false
    isFetching = false

    state = {
        messages: []
    }

    callbacks = {
        peer: AppSelectedPeer.Reactive.FireOnly
    }

    h() {
        return (
            <div class="sidebar right scrollable hidden messages-search search-results" onScroll={this.onScroll}>
                <div class="toolbar">
                    <span class="btn-icon tgico tgico-close rp rps" onClick={_ => this.openBar("nothing")}/>
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
                    <div class="section-title"> messages found</div>
                    <MessagesListFragment ref={this.messagesListRef} messages={this.state.messages} peers={this.peers}/>
                </div>
            </div>
        )
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.Peers)
            .on("updatePhotoSmall", this.onPeersPhoto)
            .on("updatePhoto", this.onPeersPhoto)
    }

    onPeersPhoto = event => {
        if (this.peers && this.peers.indexOf(event.peer) > -1) {
            this.messagesListRef.patch()
        }
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

                    if (Messages.count > 0) {
                        this.offsetId = Messages.messages[Messages.messages.length - 1].id
                    }

                    Messages.messages
                        .map(m => new SearchMessage(AppSelectedPeer.Current.dialog).fillRaw(m))
                        .forEach(m => VRDOM.append(<MessageFragment m={m}
                                                                    peers={this.peers}/>, this.messagesListRef.$el))

                    this.isFetching = false

                    if (Messages._ === "messages" || Messages.count < 20) {
                        this.offsetId = 0
                        this.allFetched = true
                    }
                }
            })
        }
    }

    onSearchInputUpdated = event => {
        const q = event.target.value.trim()

        if (q !== "" && q !== this.currentQuery) {
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

                        this.state.messages = Messages.messages.map(m => new SearchMessage(AppSelectedPeer.Current.dialog).fillRaw(m))
                        this.messagesListRef.patch({
                            messages: this.state.messages,
                            peers: this.peers
                        })

                        if (Messages.count > 0) {
                            this.offsetId = Messages.messages[Messages.messages.length - 1].id
                        }

                        if (Messages._ === "messages" || Messages.count < 20) {
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
            this.peers = []

            this.inputRef.component.$el.value = ""

            this.state.messages = []
            this.messagesListRef.patch({
                messages: this.state.messages,
                peers: this.peers
            })
        }
    }

    onScroll = event => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop) {
            this.onSearchNextPage()
        }
    }
}