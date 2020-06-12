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

import StatefulComponent from "./StatefulComponent"
import {__component_update_global_state} from "./__component_update"

class State {
    __global = true;
    __components: Set<StatefulComponent>;

    constructor() {
        this.__components = new Set();
    }

    set(nextState) {
        if (typeof nextState === "function") {
            nextState = nextState(this);
        }

        Object.assign(this, nextState);

        this.__components.forEach(component => __component_update_global_state(component, this));
    }

    static create(defaultState) {
        const state = new State();
        Object.assign(state, defaultState);
        return state;
    }
}

export default State;