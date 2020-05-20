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

import {__component_appEventsBuilder} from "./__component_appEventsBuilder";
import {__component_reactiveObjectEventsBuilder} from "./__component_reactiveObjectEventsBuilder";

export function __component_init_wip(component) {
    if (!component.__.initialized) {
        component.init = component.init.bind(component);
        component.render = component.render.bind(component);
        component.componentDidMount = component.componentDidMount.bind(component);
        component.shouldComponentUpdate = component.shouldComponentUpdate.bind(component);
        component.componentDidUpdate = component.componentDidUpdate.bind(component);
        component.forceUpdate = component.forceUpdate.bind(component);

        component.appEvents = component.appEvents.bind(component);
        component.reactive = component.reactive.bind(component);

        component.withInterval = component.withInterval.bind(component);
        component.withTimeout = component.withTimeout.bind(component);
        component.clearIntervals = component.clearIntervals.bind(component);
        component.clearTimeouts = component.clearTimeouts.bind(component);

        if (component.__.stateful) {
            component.setState = component.setState.bind(component);
        }

        component.init.call(component);

        component.appEvents(__component_appEventsBuilder(component));
        component.reactive(__component_reactiveObjectEventsBuilder(component));

        component.__.initialized = true;
    } else {
        console.warn("BUG: component already initialized")
    }
}

export default __component_init_wip