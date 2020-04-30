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

import VComponent from "./VComponent"
import {initElement} from "../render/renderElement"
import VApp from "../../vapp"
import StatefulComponent from "./StatefulComponent"
import StatelessComponent from "./StatelessComponent"

function __component_mount_wip(component: StatefulComponent | StatelessComponent, $el: HTMLElement) {
    initElement($el);

    if (component.__.mounted) {
        component.$el = $el;
        component.$el.__v.component = component;

        component.__.mounted = true;
        component.forceUpdate();

        if (!VApp.mountedComponents.has(component.identifier)) {
            console.error("BUG: component with such id was not found!", component)
            VApp.mountedComponents.set(component.identifier, component)
        }
    } else {
        initElement($el);
        component.$el = $el;
        component.$el.__v.component = component;
        
        component.__.mounted = true;

        component.componentDidMount();

        if (VApp.mountedComponents.has(component.identifier)) {
            console.error("BUG: component with such id already mounted!", component)
        } else {
            VApp.mountedComponents.set(context.identifier, component)
        }

    }
}

const __component_mount = (context: VComponent, $el: HTMLElement) => {
    // context.__.destroyed = false

    if (context.__.mounted) {
        context.__.mounted = true
        initElement($el)
        // console.warn("remounting component", context.displayName)
        context.$el = $el
        context.$el.__v.component = context
        context.forceUpdate()

        if (!VApp.mountedComponents.has(context.identifier)) {
            console.error("BUG: component with such id was not found!", context)
            VApp.mountedComponents.set(context.identifier, context)
        }
    } else {
        // console.warn("mounting component", context.displayName)
        context.__.mounted = true
        initElement($el)
        context.$el = $el
        context.$el.__v.component = context
        context.componentDidMount()

        if (VApp.mountedComponents.has(context.identifier)) {
            console.error("BUG: component with such id already mounted!", context)
        } else {
            VApp.mountedComponents.set(context.identifier, context)
        }
    }
}

export default __component_mount