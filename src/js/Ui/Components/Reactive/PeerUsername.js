/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import AppEvents from "../../../Api/EventBus/AppEvents"
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import type {AE} from "../../../V/VRDOM/component/__component_appEventsBuilder"

class PeerUsername extends StatelessComponent {
    appEvents(E: AE) {
        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.peer)
            .updateOn("peer.updateUsername")
            .updateOn("peer.update");
    }

    render({template, peer}) {
        if (template) {
            return <template peer={peer}/>;
        }

        return <span class="peer-username">{peer.username}</span>;
    }
}

export default PeerUsername;