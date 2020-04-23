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
import VComponent from "./VComponent"
import __diffObjects from "./__diffObjects"

const __component_update = (context: VComponent, {isForce = false, nextProps, nextState}) => {
    let shouldUpdate = isForce

    if (!isForce) {
        let hasNextState = false
        let hasNextProps = false

        if (nextState) {
            hasNextState = true
            nextState = {
                ...context.state,
                ...nextState
            }
        } else {
            nextState = context.state
        }

        if (nextProps) {
            hasNextProps = true
            nextProps = {
                ...context.props,
                ...nextProps
            }
        } else {
            nextProps = context.props
        }

        shouldUpdate = context.shouldComponentUpdate(nextProps, nextState)

        if (shouldUpdate === undefined) {
            if (hasNextProps) {
                const diffProps = __component_diffProps(context.props, nextProps)
                shouldUpdate = diffProps !== false
            }

            if (hasNextState && !shouldUpdate) {
                const diffState = __diffObjects(context.state, nextState)
                shouldUpdate = diffState !== false
            }
        }

        shouldUpdate = shouldUpdate !== false
    }

    if (shouldUpdate) {
        if (nextProps) {
            Object.assign(context.props, nextProps)
        }

        if (nextState) {
            Object.assign(context.state, nextState)
        }

        context.__.isUpdatingItSelf = true
        context.$el = VRDOM.patch(context.$el, context.__render())
        context.__.isUpdatingItSelf = false

        context.componentDidUpdate(null, null, null) // todo: pass previous data
    }
}

export default __component_update