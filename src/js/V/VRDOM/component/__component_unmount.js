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

import VApp from "../../vapp"
import __component_clearAppEvents from "./__component_clearAppEvents"
import __component_clearReactiveObjects from "./__component_clearReactiveObjects"

export function __component_unmount_wip(component) {
    component.componentWillUnmount();

    component.clearIntervals();
    component.clearTimeouts();

    __component_clearAppEvents(component);
    __component_clearReactiveObjects(component);

    component.$el.__v.component = null;
    component.$el = null;
    component.__.destroyed = true;
    component.__.mounted = false;

    VApp.mountedComponents.delete(component.identifier);
}

export default __component_unmount_wip