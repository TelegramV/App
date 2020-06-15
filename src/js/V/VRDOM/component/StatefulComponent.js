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
class StatefulComponent<P, S> extends VComponent<P> {
    constructor(config) {
        super(config);
        this.__update_strategy = VComponent.DEFAULT_STRATEGY;
        this.__.stateful = true;
    }

    state: S = {};

    /**
     * WARNING: Be very careful with this.
     * global state patches component without making a difference each time it updated.
     * if you want just to update the state, please do not put it here and instead update it directly.
     */
    globalState = {};

    render(props, state, globalState) {
    }

    componentWillUpdate(nextProps, nextState) {
    }

    shouldComponentUpdate(nextProps, nextState) {
    }

    setState(nextState) {
        if (this.__.destroyed) {
            return;
        }

        if (typeof nextState === "function") {
            __component_update_state(this, nextState(this.state));
        } else {
            __component_update_state(this, nextState);
        }
    }

    setGlobalState(nextState) {
        for (const [k, v] of Object.entries(nextState)) {
            this.globalState[k].set(v);
        }
    }
}

VComponent.DEFAULT_STRATEGY = 90;
VComponent.RECREATE_STRATEGY = 91;

export default StatefulComponent;