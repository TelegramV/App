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

import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import UIEvents from "../../EventBus/UIEvents"
import type {AE} from "../../../V/VRDOM/component/__component_appEventsBuilder"

type PipEvent = {
    $el: HTMLElement;
}

class PiPContainer extends StatelessComponent {
    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("pip.show", this.onShow)
            .on("pip.hide", this.onHide)
    }

    render() {
        return (
            <div style={{
                "display": "none"
            }} id="pip-container">
                <div/>
            </div>
        );
    }

    onShow = ({$el}: PipEvent) => {
        this.$el.appendChild($el);
    }

    onHide = ({$el}: PipEvent) => {
        this.$el.removeChild($el);
    }
}

export default PiPContainer;