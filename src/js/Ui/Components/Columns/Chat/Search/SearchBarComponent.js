import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent";
import classIf from "../../../../../V/VRDOM/jsx/helpers/classIf";
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import UIEvents from "../../../../EventBus/UIEvents";
import VUI from "../../../../VUI";
import {SearchDateModal} from "../../../SidebarsNeo/Right/Search/SearchDateModal";
import SearchManager from "../../../../../Api/Search/SearchManager";
import AppSelectedChat from "../../../../Reactive/SelectedChat";
import {SearchMessage} from "../../../../../Api/Messages/SearchMessage";
import {IS_SAFARI} from "../../../../../Utils/browser"

let CURRENT_QUERY = undefined
const KEYBOARD_DELAY = IS_SAFARI ? 100 : 500;
// Only for mobile
export class SearchBarComponent extends StatefulComponent {
    searchInputRef = VComponent.createComponentRef()
    footerRef = VComponent.createRef();
    upperRef = VComponent.createRef();

    state = {
        hidden: true,
        messages: [],
        currentMessage: 0,
        count: 0
    }


    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("search.open", this.open)
    }

    render() {
        return (
            <div className={["search-bar", classIf(this.state.hidden, "hidden")]}>
                <div className="upper" ref={this.upperRef}>
                    <div className="responsive-only-mobile btn-icon tgico-back" onClick={this.close}/>
                    <div className="input-search">
                        <VSimpleLazyInput type="text" placeholder="Search"
                                          ref={this.searchInputRef}
                                          onInput={this.onSearchInputUpdated}
                                          onFocus={this.onFocus}
                                          onBlur={this.updateSearchPosition}
                                          lazyLevel={500}/>
                        <span className="tgico tgico-search"/>
                    </div>
                </div>
                <div className="search-footer" ref={this.footerRef}>
                    <div className="left">
                        <div className={["btn-icon rp rps tgico-calendar", classIf(this.searchInputRef?.component?.$el.value.length > 0, "hidden")]} onClick={this.onSelectDate}/>
                        <div className="counter">{this.counterText}</div>
                    </div>

                    <div className="right">
                        <div className={["btn-icon tgico-up", classIf(!this.nextMessageEnabled, "disabled rp rps")]} onClick={this.nextMessage}/>
                        <div className={["btn-icon tgico-up rotate-180", classIf(!this.prevMessageEnabled, "disabled rp rps")]} onClick={this.prevMessage}/>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        window.visualViewport.addEventListener("resize", this.updateSearchPosition);
    }

    componentWillUnmount() {
        window.visualViewport.removeEventListener("resize", this.updateSearchPosition);
    }

    onFocus = (ev) => {
        ev.preventDefault();
        this.upperRef.$el.style.transform = `translateY(0)`; // input should be on bottom of the page
        this.searchInputRef.component.$el.focus();

        this.withTimeout(() => {
            this.updateSearchPosition();
        }, KEYBOARD_DELAY)
    }

    updateSearchPosition = () => {
        const upper = this.upperRef.$el;
        const upperHeight = upper.getBoundingClientRect().height;
        const height = window.visualViewport.height;
        const top = height-upperHeight;
        upper.style.transform = `translateY(${-top}px)`;
    }

    get counterText() {
        if(this.searchInputRef?.component?.$el.value.length === 0) {
            return ""
        }

        if(this.isFetching) {
            return "Searching..."
        }

        if(this.state.messages.length === 0) {
            return "No messages found"
        }

        return `${this.state.currentMessage + 1} of ${this.state.count}`
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

                    this.isFetching = false
                    const messages = AppSelectedChat.Current.messages.putRawMessages(Messages.messages)
                    this.state.messages.push(...messages)
                    // UIEvents.General.fire("chat.showMessage", {message: this.state.messages[this.state.currentMessage]})
                    this.nextMessage()

                    // this.forceUpdate()

                    if (Messages._ === "messages" || Messages.current_count < 20) {
                        this.offsetId = 0
                        this.allFetched = true
                    }
                }
            })
        }
    }

    onSearchInputUpdated = (event) => {
        const q = event.target.value.trim()

        if (q === "") {
            this.state.messages = []
            this.state.count = 0
            this.state.currentMessage = 0
            this.offsetId = 0

            CURRENT_QUERY = undefined
            // this.messagesCountRef.patch({
            //     count: this.state.messagesCount
            // })
            this.forceUpdate()
        } else if (q !== CURRENT_QUERY) {
            this.state.messages = []

            CURRENT_QUERY = q
            this.offsetId = 0
            this.allFetched = false
            this.isFetching = true

            if (!this.allFetched) {
                // this.messagesCountRef.patch({
                //     count: -1
                // })

                SearchManager.searchMessages(AppSelectedChat.Current, {
                    q,
                    limit: 20,
                    offsetId: this.offsetId
                }).then(Messages => {
                    if (Messages.__q === CURRENT_QUERY) {
                        if(Messages.current_count === 0) {
                            this.offsetId = 0
                            this.allFetched = true
                            this.isFetching = false
                            this.forceUpdate()
                            return
                        }
                        this.state.count = Messages.count || Messages.current_count

                        // this.state.messages.set(Messages.messages.map(m => new SearchMessage(AppSelectedChat.Current).fillRaw(m)))

                        // this.state.messagesCount = Messages.count || Messages.current_count
                        // this.messagesCountRef.patch({
                        //     count: this.state.messagesCount
                        // })

                        if (Messages.current_count > 0) {
                            this.offsetId = Messages.messages[Messages.messages.length - 1].id
                        }

                        if (Messages._ === "messages" || Messages.current_count < 20) {
                            this.offsetId = 0
                            this.allFetched = true
                        }

                        const messages = AppSelectedChat.Current.messages.putRawMessages(Messages.messages)
                        this.state.messages.push(...messages)
                        this.state.currentMessage = 0
                        UIEvents.General.fire("chat.showMessage", {message: this.state.messages[this.state.currentMessage]})
                        this.isFetching = false

                        this.forceUpdate()
                    }
                })
            }
        }
        this.forceUpdate()
    }

    get nextMessageEnabled() {
        return this.state.currentMessage < this.state.count - 1
    }


    nextMessage = () => {
        if(!this.nextMessageEnabled) {
            return
        }

        if(this.state.currentMessage >= this.state.messages.length - 1) {
            this.onSearchNextPage()
            return
        }
        this.state.currentMessage++
        UIEvents.General.fire("chat.showMessage", {message: this.state.messages[this.state.currentMessage]})
        this.forceUpdate()
    }

    get prevMessageEnabled() {
        return this.state.currentMessage > 0
    }

    prevMessage = () => {
        if(!this.prevMessageEnabled) {
            return
        }
        this.state.currentMessage--

        UIEvents.General.fire("chat.showMessage", {message: this.state.messages[this.state.currentMessage]})
        this.forceUpdate()

    }

    onSelectDate = () => {
        VUI.Modal.open(<SearchDateModal/>)
    }

    close = () => {
        UIEvents.General.fire("search.close")
        this.searchInputRef.component.$el.value = ""
        this.setState({
            hidden: true
        })
    }

    open = () => {
        this.setState({
            hidden: false
        })
        this.searchInputRef.component.$el.focus()

    }
}