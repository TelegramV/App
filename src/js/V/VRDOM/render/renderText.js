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

import VApp from "../../../vapp"

const renderText = text => {
    if (VApp.interceptor) {
        const intercepted = VApp.interceptor.textInterceptCreate(text)

        if (intercepted === undefined) {
            return document.createTextNode(text)
        } else if (intercepted instanceof Node) {
            return intercepted
        } else if (intercepted instanceof NodeList || Array.isArray(intercepted) || intercepted[Symbol.iterator]) {
            return intercepted
        }
    }

    return document.createTextNode(text)
}

export default renderText