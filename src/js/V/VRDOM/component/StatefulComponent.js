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

import {__component_update_state} from "./__component_update";
import VComponent from "./VComponent"

// wip
class StatefulComponent extends VComponent {
    constructor(config) {
        super(config);
        this.__.stateful = true;
    }

    state = {};

    render(props, state) {
    }

    setState(nextState) {
        if (typeof nextState === "function") {
            __component_update_state(this, nextState(this.state));
        } else {
            __component_update_state(this, nextState);
        }
    }
}

export default StatefulComponent;