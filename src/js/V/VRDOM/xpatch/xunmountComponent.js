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

import __component_clearAppEvents from "../component/__component_clearAppEvents"

function unmountComponent(component) {
    component.componentWillUnmount();

    component.clearIntervals();
    component.clearTimeouts();

    __component_clearAppEvents(component);

    component.props = null;
    component.slot = null;

    if (component.__.stateful && component.globalState) {
        if (component.globalState) {
            for (const state of Object.values(component.globalState)) {
                state.__components.delete(component);
            }
        }
    }
    component.state = null;

    component.$el.__v.component = null;
    component.$el = null;
    component.__.destroyed = true;
    component.__.mounted = false;
}

export default unmountComponent;