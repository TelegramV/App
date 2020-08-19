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

import __component_diffProps from "./__component_diffProps"
import __diffObjects from "./__diffObjects"
import __component_render from "./__component_render"
import vrdom_patch from "../patch/patch"
import __component_withDefaultProps from "./__component_withDefaultProps"
import __component_recreateReactiveObjects from "./__component_recreateReactiveObjects"
import patchElement from "../patch/patchElement"

const patch = component =>
    // throttle(
    () => {
        if (component.__.mounted) {
            component.__.isUpdatingItSelf = true;
            component.$el = vrdom_patch(component.$el, __component_render(component))
            component.__.isUpdatingItSelf = false;

            component.componentDidUpdate();
        }
    }

// , 100, component);

export function __component_update_props(component, nextProps) {
    if (nextProps) {
        nextProps = __component_withDefaultProps(component, nextProps);

        let shouldUpdate = component.shouldComponentUpdate(nextProps, component.state);

        if (shouldUpdate === undefined) {
            const diffProps = __component_diffProps(component, nextProps);
            shouldUpdate = diffProps !== false;
        }

        if (shouldUpdate) {
            component.componentWillUpdate(nextProps, component.state);

            if (component.__.stateful) {
                const derivedState = component.constructor.getDerivedStateFromProps(nextProps, component.state);

                if (derivedState) {
                    if (derivedState.__state_shared) {
                        throw new Error("shared state cannot be used with getDerivedStateFromProps")
                    } else {
                        Object.assign(component.state, derivedState);
                    }
                }
            }

            Object.assign(component.props, nextProps);

            __component_recreateReactiveObjects(component);

            patch(component)();
        }
    }
}

export function __component_update_state(component, nextState) {
    if (nextState) {
        let shouldUpdate = component.shouldComponentUpdate(component.props, nextState);

        if (shouldUpdate === undefined) {
            const diffState = __diffObjects(component.state, nextState);
            shouldUpdate = diffState !== false;
        }

        if (shouldUpdate) {
            component.componentWillUpdate(component.props, nextState);

            Object.assign(component.state, nextState);

            __component_recreateReactiveObjects(component);

            patch(component)();
        }
    }
}

export function __component_update_shared_state(component, globalState) {
    if (globalState) {
        component.componentWillUpdate(component.props, component.state);

        patch(component)();
    }
}

export function __component_update_custom_state(component, state) {
    if (state) {
        component.componentWillUpdate(component.props, component.state);

        if (component.__.mounted) {
            component.__.isUpdatingItSelf = true;
            component.$el = vrdom_patch(component.$el, __component_render(component))
            component.__.isUpdatingItSelf = false;

            component.componentDidUpdate();
        }
    }
}

export function __component_patch(component) {
    component.__.isUpdatingItSelf = true;
    component.$el = vrdom_patch(component.$el, __component_render(component))
    component.__.isUpdatingItSelf = false;
}

export function __component_just_patch_element(component, $el) {
    component.$el = patchElement($el || component.$el, __component_render(component))
}

export function __component_update_force(component, nextProps, nextState) {
    if (component.__.mounted) {
        component.componentWillUpdate(nextProps || component.props, nextState || component.state);
    }

    if (nextProps) {
        Object.assign(component.props, nextProps);
    }

    if (nextState) {
        Object.assign(component.state, nextState);
    }

    __component_recreateReactiveObjects(component);

    patch(component)();
}