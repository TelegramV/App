import {RightBarComponent} from "../RightBarComponent"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import SearchManager from "../../../../../../Api/Search/SearchManager"
import LazyInput from "../../../../Elements/LazyInput"
import AppSelectedChat from "../../../../../Reactive/SelectedChat"
import {SearchMessage} from "../../../../../../Api/Messages/SearchMessage"
import UIEvents from "../../../../../EventBus/UIEvents"
import {highlightVRNodeWord} from "../../../../../Utils/highlightVRNodeText"
import ContactComponent from "../../../../Basic/ContactComponent"
import List from "../../../../../../V/VRDOM/list/List"
import VArray from "../../../../../../V/VRDOM/list/VArray"
import PeersStore from "../../../../../../Api/Store/PeersStore"

let CURRENT_QUERY = undefined

const MessageFragmentItemTemplate = (message) => {
    const peer = message.to === PeersStore.self() ? message.from : message.to

    return <ContactComponent peer={peer}
                             fetchFull={false}
                             name={peer.name}
                             status={<span>{message.prefix}{highlightVRNodeWord(message.text, CURRENT_QUERY)}</span>}
                             time={message.getFormattedDate()}
                             onClick={() => UIEvents.Bubbles.fire("showMessageInstant", message)}/>
}

const MessagesCountFragment = ({count}) => {
    let slot = undefined

    if (count === -2) {
        slot = <span>Type to search</span>
    } else if (count === -1) {
        slot = <span className="loading-text">Searching...</span>
    } else {
        slot = <span>{count} messages found</span>
    }

    return <div className="section-title">{slot}</div>
}

export default class MessageSearchComponent extends RightBarComponent {

    barName = "messages-search"
    barVisible = false

    messagesCountRef = VComponent.createFragmentRef()
    inputRef = VComponent.createComponentRef()

    offsetId = 0
    allFetched = false
    isFetching = false

    state = {
        messages: new VArray(),
        messagesCount: -2
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(UIEvents.RightSidebar)
            .on("setSearchQuery", this.onSetSearchQuery)

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
    }

    render() {
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
                    <MessagesCountFragment ref={this.messagesCountRef}
                                           count={this.state.messagesCount}/>

                    <List list={this.state.messages}
                          template={MessageFragmentItemTemplate}
                          wrapper={<div className="column-list"/>}/>
                </div>
            </div>
        )
    }

    onChatSelect = _ => {
        CURRENT_QUERY = undefined
        this.offsetId = 0
        this.allFetched = false
        this.isFetching = true

        this.inputRef.component.$el.value = ""

        this.state.messages.set([])
        this.state.messagesCount = -2
        this.messagesCountRef.patch({
            count: this.state.messagesCount
        })
        this.hideBar()
    }

    onSearchNextPage = _ => {
        if (!this.isFetching && CURRENT_QUERY !== "" && !this.allFetched && this.offsetId) {
            this.isFetching = true

            SearchManager.searchMessages(AppSelectedChat.Current, {
                q: CURRENT_QUERY,
                limit: 20,
                offsetId: this.offsetId
            }).then(Messages => {
                if (Messages.__q === CURRENT_QUERY) {
                    if (Messages.current_count > 0) {
                        this.offsetId = Messages.messages[Messages.messages.length - 1].id
                    }

                    Messages.messages
                        .map(m => new SearchMessage(AppSelectedChat.Current).fillRaw(m))
                        .forEach(m => this.state.messages.add(m))

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
            CURRENT_QUERY = undefined
            this.state.messagesCount = -2
            this.messagesCountRef.patch({
                count: this.state.messagesCount
            })
            this.state.messages.clear()
        } else if (q !== CURRENT_QUERY) {
            CURRENT_QUERY = q
            this.offsetId = 0
            this.allFetched = false
            this.isFetching = true

            if (!this.allFetched) {
                this.messagesCountRef.patch({
                    count: -1
                })

                SearchManager.searchMessages(AppSelectedChat.Current, {
                    q,
                    limit: 20,
                    offsetId: this.offsetId
                }).then(Messages => {
                    if (Messages.__q === CURRENT_QUERY) {
                        this.peers = []

                        this.state.messages.set(Messages.messages.map(m => new SearchMessage(AppSelectedChat.Current).fillRaw(m)))
                        this.state.messagesCount = Messages.count || Messages.current_count
                        this.messagesCountRef.patch({
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