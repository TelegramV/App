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
import VApp from "../../vapp"

const __component_unmount = (context: VComponent) => {
    // console.debug("unmounting", context.identifier, context.displayName)
    context.componentWillUnmount()

    context.clearIntervals()
    context.clearTimeouts()

    context.__unregisterAppEventResolves()
    context.__unregisterReactiveObjectResolves()

    context.$el.__v.component = undefined
    context.$el = undefined
    context.__.destroyed = true
    context.__.mounted = false

    VApp.mountedComponents.delete(context.identifier)
}

export default __component_unmount