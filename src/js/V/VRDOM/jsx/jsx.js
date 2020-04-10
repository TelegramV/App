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

import type {VRAttrs, VREvents, VRStyle, VRTagName} from "../types/types"
import VRNode from "../VRNode"
import attrAliases from "./attrAliases"
import attrProcessors from "./attrProcessors/attrProcessors"
import vrdom_createElement from "../createElement"
import VRDOM from "../VRDOM"
import postAttrProcessor from "./attrProcessors/postAttrProcessor"
import vrdom_isTagNameComponentOrFragment from "../is/isTagNameComponentOrFragment"

/**
 * JSX Translator
 *
 * @param tagName
 * @param attributes
 * @param children
 */
function vrdom_jsx(tagName: VRTagName, attributes: VRAttrs, ...children: Array<VRNode>) {
    if (tagName === VRDOM.Fragment) {
        console.warn("fragments are not fully implemented: patch is not working")
    }

    children = children.flat(Infinity)

    const attrs: VRAttrs = Object.create(null)
    const events: VREvents = Object.create(null)
    const style: VRStyle = Object.create(null)

    let ref = undefined
    let dangerouslySetInnerHTML: boolean = false

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            const isComponentOrFragment = vrdom_isTagNameComponentOrFragment(tagName)
            let key = isComponentOrFragment ? k : k.toLowerCase()

            if (key.startsWith("on") && !isComponentOrFragment) {
                events[key.substring(2).toLowerCase()] = v
            } else if (k === "dangerouslySetInnerHTML") {
                dangerouslySetInnerHTML = v
                attrs["vr-dangerouslySetInnerHTML"] = true
            } else if (key.startsWith("css-")) {
                const styleKey = key.substring(4)
                style[styleKey] = v
            } else if (k === "showIf") {
                style.display = v ? undefined : "none"
            } else if (k === "hideIf") {
                style.display = v ? "none" : undefined
            } else if (key === "ref") {
                ref = v
            } else if (key === "style" && typeof v === "object") {
                Object.assign(style, v)
            } else {
                if (attrAliases.has(k)) {
                    key = attrAliases.get(k)
                    attrs[key] = v
                } else {
                    attrs[key] = v
                }
            }

            if (attrProcessors.has(key)) {
                attrs[key] = attrProcessors.get(key)(v)
            }

            attrs[key] = postAttrProcessor(key, attrs[key])
        }
    }

    return vrdom_createElement(tagName, {
        attrs,
        events,
        children,
        ref,
        style,

        dangerouslySetInnerHTML
    })
}

export default vrdom_jsx