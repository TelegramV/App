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
import vrdom_deleteInner from "../deleteInner"
import {initElement} from "../render/renderElement"
import __component_unmount from "../component/__component_unmount"

const patchVRNodeNull = ($node: Element) => {
    initElement($node)

    if ($node.__v && $node.__v.component) {
        __component_unmount($node.__v.component)
    }

    vrdom_deleteInner($node)

    const $newNode = document.createTextNode("")
    $node.replaceWith($newNode)

    return $newNode
}

export default patchVRNodeNull