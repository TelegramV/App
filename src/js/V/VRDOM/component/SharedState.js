/*
 * Telegram V
 * Copyright (C) 2020 Davyd Kohut
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
import {__component_update_shared_state} from "./__component_update"

class State {
    set(nextState) {
        if (typeof nextState === "function") {
            nextState = nextState(this);
        }

        Object.assign(this, nextState);
    }
}

// lala lala lala la no time(((
class ComponentState extends State {
    component = null;

    static getDerivedStateFromProps() {
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    set(nextState) {
        if (typeof nextState === "function") {
            nextState = nextState(this);
        }

        Object.assign(this, nextState);

        __component_update_shared_state(this.component, this);
    }
}

class SharedState {
    __state_shared = true;

    __destroyed = false;
    __components: Set<StatefulComponent>;
    __strategy = SharedState.STAY_ALIVE;

    constructor() {
        this.__components = new Set();
    }

    set(nextState) {
        if (typeof nextState === "function") {
            nextState = nextState(this);
        }

        Object.assign(this, nextState);

        this.__components.forEach(component => __component_update_shared_state(component, this));
    }

    setExcluding(nextState, excludeComponent) {
        if (typeof nextState === "function") {
            nextState = nextState(this);
        }

        Object.assign(this, nextState);

        this.__components.forEach(component => component !== excludeComponent && __component_update_shared_state(component, this));
    }

    static create(defaultState) {
        const state = new SharedState();
        Object.assign(state, defaultState);
        return state;
    }
}

SharedState.STAY_ALIVE = 0; // state will be available even if there is no component which uses it
SharedState.DESTROY = 0; // state will be destroyed if no component references to it

export default SharedState;