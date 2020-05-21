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

import __component_diffProps from "./__component_diffProps"
import __diffObjects from "./__diffObjects"
import __component_render from "./__component_render"
import vrdom_patch from "../patch/patch"
import __component_withDefaultProps from "./__component_withDefaultProps"
import __component_recreateReactiveObjects from "./__component_recreateReactiveObjects"

export function __component_update_props(component, nextProps) {
    if (nextProps) {
        nextProps = __component_withDefaultProps(component, {
            ...component.props,
            ...nextProps
        });

        let shouldUpdate = component.shouldComponentUpdate(nextProps, component.state);

        if (shouldUpdate === undefined) {
            const diffProps = __component_diffProps(component, nextProps);
            shouldUpdate = diffProps !== false;
        }

        if (shouldUpdate) {
            Object.assign(component.props, nextProps);

            __component_recreateReactiveObjects(component);

            component.__.isUpdatingItSelf = true;
            component.$el = vrdom_patch(component.$el, __component_render(component))
            component.__.isUpdatingItSelf = false;

            component.componentDidUpdate();
        }
    }
}

export function __component_update_state(component, nextState) {
    if (nextState) {
        nextState = {
            ...component.state,
            ...nextState
        };

        let shouldUpdate = component.shouldComponentUpdate(component.props, nextState);

        if (shouldUpdate === undefined) {
            const diffState = __diffObjects(component.state, nextState);
            shouldUpdate = diffState !== false;
        }

        if (shouldUpdate) {
            Object.assign(component.state, nextState);

            __component_recreateReactiveObjects(component);

            component.__.isUpdatingItSelf = true;
            component.$el = vrdom_patch(component.$el, __component_render(component))
            component.__.isUpdatingItSelf = false;

            component.componentDidUpdate();
        }
    }
}

export function __component_update_force(component, nextProps, nextState) {
    if (nextProps) {
        Object.assign(component.props, nextProps);
    }

    if (nextState) {
        Object.assign(component.state, nextState);
    }

    __component_recreateReactiveObjects(component);

    component.__.isUpdatingItSelf = true;
    component.$el = vrdom_patch(component.$el, __component_render(component))
    component.__.isUpdatingItSelf = false;

    component.componentDidUpdate();
}