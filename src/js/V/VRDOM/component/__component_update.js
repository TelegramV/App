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
import __component_render_wip from "./__component_render"
import vrdom_patch from "../patch/patch"

export function __component_update_wip(component, {isForce, nextState, nextProps}) {
    const isStateful = component.__.stateful;

    let shouldUpdate = isForce;

    if (!isForce) {
        let hasNextState = false
        let hasNextProps = false

        if (isStateful) {
            if (nextState) {
                hasNextState = true;
                nextState = {
                    ...component.state,
                    ...nextState
                };
            } else {
                nextState = component.state;
            }
        }

        if (nextProps) {
            hasNextProps = true;
            nextProps = {
                ...component.props,
                ...nextProps
            };
        } else {
            nextProps = component.props;
        }

        shouldUpdate = component.shouldComponentUpdate(nextProps, nextState);

        if (shouldUpdate === undefined) {
            if (hasNextProps) {
                const diffProps = __component_diffProps(component, nextProps);
                shouldUpdate = diffProps !== false;
            }

            if (isStateful) {
                if (hasNextState && !shouldUpdate) {
                    const diffState = __diffObjects(component.state, nextState);
                    shouldUpdate = diffState !== false;
                }
            }
        }

        shouldUpdate = shouldUpdate !== false;
    }

    if (shouldUpdate) {
        if (nextProps) {
            Object.assign(component.props, nextProps);
        }

        if (isStateful && nextState) {
            Object.assign(component.state, nextState);
        }

        component.__.isUpdatingItSelf = true;
        component.$el = vrdom_patch(component.$el, __component_render_wip(component))
        component.__.isUpdatingItSelf = false;

        component.componentDidUpdate(null, null, null); // todo: pass previous data
    }
}

export default __component_update_wip