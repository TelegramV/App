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

import {initElement} from "../render/renderElement"
import VApp from "../../vapp"

export function __component_mount_wip(component, $el: HTMLElement) {
    initElement($el);

    if (component.__.mounted) {
        component.__.mounted = true;

        component.$el = $el;
        component.$el.__v.component = component;

        component.forceUpdate();

        if (!VApp.mountedComponents.has(component.identifier)) {
            console.error("BUG: component with such id was not found!", component)
            VApp.mountedComponents.set(component.identifier, component)
        }
    } else {
        component.__.mounted = true;

        component.$el = $el;
        component.$el.__v.component = component;

        component.componentDidMount();

        if (VApp.mountedComponents.has(component.identifier)) {
            console.error("BUG: component with such id already mounted!", component)
        } else {
            VApp.mountedComponents.set(component.identifier, component)
        }

    }
}

export default __component_mount_wip