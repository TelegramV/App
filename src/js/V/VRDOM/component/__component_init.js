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

import VComponent from "./VComponent";
import {__component_appEventsBuilder} from "./__component_appEventsBuilder";
import {__component_reactiveObjectEventsBuilder} from "./__component_reactiveObjectEventsBuilder";
import StatefulComponent from "./StatefulComponent";
import StatelessComponent from "./StatelessComponent";

function __component_init_wip(component: StatefulComponent | StatelessComponent) {
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

        if (component instanceof StatefulComponent) {
            component.setState = component.setState.bind(component);
        }

        component.appEvents(__component_appEventsBuilder(component));
        component.reactive(__component_reactiveObjectEventsBuilder(component));

        component.init();

        component.__.initialized = true;
    } else {
        console.warn("BUG: component already initialized")
    }
}

const __component_init = (context: VComponent) => {
    if (!context.__.inited) {
        context.init = context.init.bind(context)
        context.render = context.render.bind(context)
        context.componentDidMount = context.componentDidMount.bind(context)
        context.shouldComponentUpdate = context.shouldComponentUpdate.bind(context)
        context.componentDidUpdate = context.componentDidUpdate.bind(context)
        context.setState = context.setState.bind(context)
        context.forceUpdate = context.forceUpdate.bind(context)

        context.__update = context.__update.bind(context)
        context.__mount = context.__mount.bind(context)
        context.__unmount = context.__unmount.bind(context)
        context.__render = context.__render.bind(context)

        context.appEvents = context.appEvents.bind(context)
        context.reactive = context.reactive.bind(context)

        context.__unregisterAppEventResolves = context.__unregisterAppEventResolves.bind(context)
        context.__unregisterAppEventResolve = context.__unregisterAppEventResolve.bind(context)
        context.__recreateAppEventsResolves = context.__recreateAppEventsResolves.bind(context)

        context.__unregisterReactiveObjectResolves = context.__unregisterReactiveObjectResolves.bind(context)
        context.__unregisterReactiveObjectResolve = context.__unregisterReactiveObjectResolve.bind(context)
        context.__recreateReactiveObjects = context.__recreateReactiveObjects.bind(context)

        context.withInterval = context.withInterval.bind(context)
        context.withTimeout = context.withTimeout.bind(context)
        context.clearIntervals = context.clearIntervals.bind(context)
        context.clearTimeouts = context.clearTimeouts.bind(context)

        context.init.call(context)


        context.appEvents(__component_appEventsBuilder(context))
        context.reactive(__component_reactiveObjectEventsBuilder(context))

        context.__.inited = true
    } else {
        console.error("BUG: component is already inited!")
    }
}

export default __component_init