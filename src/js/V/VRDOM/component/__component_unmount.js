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

import VApp from "../../vapp"
import __component_clearAppEvents from "./__component_clearAppEvents"
import __component_clearReactiveObjects from "./__component_clearReactiveObjects"

export function __component_unmount(component) {
    component.componentWillUnmount();

    component.clearIntervals();
    component.clearTimeouts();

    __component_clearAppEvents(component);
    __component_clearReactiveObjects(component);

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

    VApp.mountedComponents.delete(component.identifier);
}

export default __component_unmount