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
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"

class PeerBio extends StatelessComponent {
    appEvents(E: AE) {
        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.peer)
            .updateOn("peer.updateBio")
            .updateOn("peer.updateFull")
            .updateOn("peer.update");
    }

    render() {
        const {template, peer} = this.props;

        if (template) {
            return <template peer={peer}/>;
        }

        return <span class="peer-bio">{peer.full.bio}</span>;
    }

    componentDidMount() {
        if (!this.props.peer.full) {
            this.props.peer.fetchFull();
        }
    }
}

export default PeerBio;