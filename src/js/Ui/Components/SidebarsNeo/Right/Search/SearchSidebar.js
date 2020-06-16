import {RightSidebar} from "../RightSidebar";
import PeersStore from "../../../../../Api/Store/PeersStore";
import ContactComponent from "../../../Basic/ContactComponent";
import {highlightVRNodeWord} from "../../../../Utils/highlightVRNodeText";
import UIEvents from "../../../../EventBus/UIEvents";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import VArray from "../../../../../V/VRDOM/list/VArray";
import List from "../../../../../V/VRDOM/list/List";
import {Section} from "../../Fragments/Section";
import SearchManager from "../../../../../Api/Search/SearchManager";
import AppSelectedChat from "../../../../Reactive/SelectedChat";
import {SearchMessage} from "../../../../../Api/Messages/SearchMessage";
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput";
import VCalendar from "../../../../Elements/VCalendar";
import Footer from "../../Fragments/Footer";
import VUI from "../../../../VUI";
import {SearchDateModal} from "./SearchDateModal";
import classIf from "../../../../../V/VRDOM/jsx/helpers/classIf";

let CURRENT_QUERY = undefined

const MessageFragmentItemTemplate = (message) => {
    const peer = message.to === PeersStore.self() ? message.from : message.to

    return <ContactComponent peer={peer}
                             fetchFull={false}
                             name={peer.name}
                             status={<span>{message.prefix}{highlightVRNodeWord(message.text, CURRENT_QUERY)}</span>}
                             time={message.getFormattedDate()}
                             onClick={() => UIEvents.General.fire("chat.showMessage", {message: message})}/>
}

const MessagesCountFragment = ({count}) => {
    let slot = undefined

    if (count === -2) {
        slot = <span>Type to search</span>
    } else if (count === -1) {
        slot = <span className="loading-text">Searching</span>
    } else if (count === 1) {
        slot = <span>1 message found</span>
    } else {
        slot = <span>{count || "No"} messages found</span>
    }

    return <div className="section-title">{slot}</div>
}

export class SearchSidebar extends RightSidebar {
    messagesCountRef = VComponent.createFragmentRef()
    footerRef = VComponent.createFragmentRef()

    offsetId = 0
    allFetched = false
    isFetching = false

    state = {
        messages: new VArray(),
        messagesCount: -2
    }

    appEvents(E: AE) {
        E.bus(UIEvents.RightSidebar)
            .on("setSearchQuery", this.onSetSearchQuery)

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
    }

    content(): * {
        return <this.contentWrapper>
            <Section title={<MessagesCountFragment ref={this.messagesCountRef} count={this.state.messagesCount}/>}>
                <List list={this.state.messages}
                      template={MessageFragmentItemTemplate}
                      wrapper={<div/>}/>
            </Section>
            <Footer ref={this.footerRef} left={<div className={["btn-icon rp rps tgico-calendar", classIf(this.searchInputRef?.component?.$el.value.length > 0, "hidden")]} onClick={this.onSelectDate}/>}

                    right={<>
                        <div className={["btn-icon rp rps tgico-up"]} onClick/>
                        <div className={["btn-icon rp rps tgico-up rotate-180"]} onClick/>
                    </>}/>
        </this.contentWrapper>
    }

    onSelectDate = _ => {
        VUI.Modal.open(<SearchDateModal/>)
    }

    onChatSelect = _ => {
        CURRENT_QUERY = undefined
        this.offsetId = 0
        this.allFetched = false
        this.isFetching = true

        this.searchInputRef.component.$el.value = ""

        this.state.messages.set([])
        this.state.messagesCount = -2
        this.messagesCountRef.patch({
            count: this.state.messagesCount
        })

        UIEvents.Sidebars.fire("pop", this)
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
            this.state.messages.clear()

            CURRENT_QUERY = undefined
            this.state.messagesCount = -2
            this.messagesCountRef.patch({
                count: this.state.messagesCount
            })
            this.state.messages.clear()
        } else if (q !== CURRENT_QUERY) {
            this.state.messages.clear()

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
        this.footerRef.patch({
            left: <div className={["btn-icon rp rps tgico-calendar", classIf(this.searchInputRef?.component?.$el.value.length > 0, "hidden")]} onClick={this.onSelectDate}/>,
            right: <>
                <div className={["btn-icon rp rps tgico-up"]} onClick/>
                <div className={["btn-icon rp rps tgico-up rotate-180"]} onClick/>
            </>
        })
    }

    onSetSearchQuery = event => {
        this.searchInputRef.component.$el.value = event.q

        this.onSearchInputUpdated({
            target: {
                value: event.q
            }
        })

        UIEvents.Sidebars.fire("push", SearchSidebar)
    }

    onScroll = event => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop) {
            this.onSearchNextPage()
        }
    }

    get searchLazyLevel(): number {
        return 500
    }

    get isSearchAsTitle(): boolean {
        return true
    }
}