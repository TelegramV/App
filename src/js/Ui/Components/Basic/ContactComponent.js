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

import AppEvents from "../../../Api/EventBus/AppEvents"
import {ContactFragment} from "./ContactFragment"
import {callOrReturn} from "../../../Utils/func"
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"

class ContactComponent extends StatelessComponent {
    init() {
        this.loadFullIfNeeded()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.loadFullIfNeeded()
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.peer)
            .on("updatePhoto")
            .on("updatePhotoSmall")
            .on("updateUserStatus")
            .on("fullLoaded")
    }

    // reactive(R) {
    //     R.object(this.props.peer)
    //         .
    // }

    render() {
        return <ContactFragment name={callOrReturn(this.props.name)}
                                status={callOrReturn(this.props.status)}
                                onClick={this.props.onClick}
                                time={this.props.time}
                                peer={this.props.peer}/>
    }

    loadFullIfNeeded = () => {
        if (this.props.fetchFull && this.props.peer.type !== "user" && !this.props.peer.full) {
            this.props.peer.fetchFull()
        }
    }
}

export default ContactComponent