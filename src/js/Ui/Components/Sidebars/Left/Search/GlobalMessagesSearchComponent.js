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

import VComponent from "../../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import SearchManager from "../../../../../Api/Search/SearchManager"
import PeersStore from "../../../../../Api/Store/PeersStore"
import {highlightVRNodeWord} from "../../../../Utils/highlightVRNodeText"
import ContactComponent from "../../../Basic/ContactComponent"
import VArray from "../../../../../V/VRDOM/list/VArray"
import List from "../../../../../V/VRDOM/list/List"

const MessageFragmentItemTemplate = (message) => {
    const peer = message.to === PeersStore.self() ? message.from : message.to

    return <ContactComponent peer={peer}
                             fetchFull={false}
                             name={peer.name}
                             status={<span>{message.prefix}{highlightVRNodeWord(message.text, CURRENT_QUERY)}</span>}
                             time={message.getFormattedDate()}
                             onClick={() => UIEvents.Bubbles.fire("showMessageInstant", message)}/>
}

let CURRENT_QUERY = undefined

export class GlobalMessagesSearchComponent extends VComponent {

    offsetRate = 0
    allFetched = false
    isFetching = false

    state = {
        messages: new VArray(),
    }

    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)
            .on("searchInputNextPage", this.onSearchBarNextPage)
    }

    render() {
        return (
            <div className="global-messages section">
                <div className="section-title">Global search</div>
                <List list={this.state.messages}
                      template={MessageFragmentItemTemplate}
                      wrapper={<div className="column-list"/>}/>
            </div>
        )
    }

    onSearchBarNextPage = _ => {
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

            if (!this.allFetched) {
                SearchManager.globalSearch(q, {limit: 20, offsetRate: this.offsetRate}).then(Messages => {
                    if (Messages.__q === CURRENT_QUERY) {
                        this.state.messages.set(Messages.messages)
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