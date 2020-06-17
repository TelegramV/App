/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import UIEvents from "../../../../EventBus/UIEvents"
import SearchManager from "../../../../../Api/Search/SearchManager"
import PeersStore from "../../../../../Api/Store/PeersStore"
import {highlightVRNodeWord} from "../../../../Utils/highlightVRNodeText"
import ContactComponent from "../../../Basic/ContactComponent"
import VArray from "../../../../../V/VRDOM/list/VArray"
import List from "../../../../../V/VRDOM/list/List"
import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import {Section} from "../../Fragments/Section";

const MessageFragmentItemTemplate = (message) => {
    const peer = message.to === PeersStore.self() ? message.from : message.to

    return <ContactComponent peer={peer}
                             fetchFull={false}
                             name={peer.name}
                             status={<span>{message.prefix}{highlightVRNodeWord(message.text, CURRENT_QUERY)}</span>}
                             time={message.getFormattedDateOrTime()}
                             onClick={() => UIEvents.General.fire("chat.showMessage", {message: message})}/>
}

let CURRENT_QUERY = undefined

export class GlobalMessagesSearchComponent extends StatefulComponent {

    offsetRate = 0
    allFetched = false
    isFetching = false

    state = {
        messages: new VArray(),
        isSearching: true
    }

    appEvents(E) {
        E.bus(UIEvents.Sidebars)
            .on("searchInputUpdated", this.onSearchInputUpdated)
            .on("searchInputNextPage", this.onSearchBarNextPage)
    }

    render() {
        return (
            <div className="section" css-display={this.state.messages.size() === 0 && !this.state.isSearching ? "none" : undefined}>
                <div className="title">{this.state.isSearching ? "Searching messages..." : "Messages"}</div>
                {/*<div className="section-title">{this.state.isSearching ? "Searching messages..." : "Messages"}</div>*/}
                <List list={this.state.messages}
                      template={MessageFragmentItemTemplate}
                      wrapper={<div className="column-list"/>}/>
            </div>
        )
    }

    onSearchBarNextPage = _ => {
        console.log("onSearchBarNextPage")
        if (!this.isFetching && CURRENT_QUERY !== "" && !this.allFetched && this.offsetRate) {
            this.isFetching = true

            SearchManager.globalSearch(CURRENT_QUERY, {limit: 20, offsetRate: this.offsetRate}).then(Messages => {
                if (Messages.__q === CURRENT_QUERY) {
                    Messages.messages.shift()

                    this.state.messages.addMany(Messages.messages)
                    this.offsetRate = Messages.next_rate

                    this.isFetching = false

                    if (Messages._ === "messages" || Messages.count < 20) {
                        this.offsetRate = 0
                        this.allFetched = true
                    }
                    this.forceUpdate()
                }
            })
        }
    }

    onSearchInputUpdated = event => {
        const q = event.string.trim()

        if (q !== "" && q !== CURRENT_QUERY) {
            CURRENT_QUERY = q
            this.offsetRate = 0
            this.allFetched = false
            this.isFetching = true
            this.$el.classList.remove("hidden")

            this.setState({
                isSearching: true
            })

            if (!this.allFetched) {
                SearchManager.globalSearch(q, {limit: 20, offsetRate: this.offsetRate}).then(Messages => {
                    if (Messages.__q === CURRENT_QUERY) {
                        this.setState({
                            isSearching: false
                        })

                        this.state.messages.set(Messages.messages)
                        this.offsetRate = Messages.next_rate

                        this.isFetching = false

                        if (Messages._ === "messages" || Messages.count < 20) {
                            this.offsetRate = 0
                            this.allFetched = true
                        }

                        if (Messages.count === 0) {
                            this.$el.classList.add("hidden")
                        }
                        this.forceUpdate()
                    }
                })
            }
        }
    }
}