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

import VComponent from "../component/VComponent"
import VApp from "../../vapp"

class ComponentRef {
    __component_ref = true
    identifier: number

    component: VComponent

    constructor() {
        this.identifier = ++(VApp.latestInstantiatedRef)
    }

    unmount() {
        this.component && this.component.__unmount()
        this.component = undefined
    }
}

export default ComponentRef