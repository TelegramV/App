/*
 * Telegram V
 * Copyright (C) 2020 original authors
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

import type {VRAttrs, VREvents, VRStyle, VRTagName} from "../types/types"
import VRNode from "../VRNode"
import attrAliases from "./attrAliases"
import attrProcessors from "./attrProcessors/attrProcessors"
import vrdom_createElement from "../createElement"
import VRDOM from "../VRDOM"
import postAttrProcessor from "./attrProcessors/postAttrProcessor"
import vrdom_isTagNameComponentOrFragment from "../is/isTagNameComponentOrFragment"
import {text2emoji} from "../../../Ui/Plugins/EmojiTextInterceptor"

let intercepted = false

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

    if (!intercepted) {
        intercepted = true

        children = children.map(child => {
            if (typeof child === "string") {
                return text2emoji(child)
            }

            // basic <></> support
            if (child && typeof child === "object" && child.tagName === VRDOM.Fragment) {
                return child.children;
            }

            return child
        }).flat(Infinity)

        intercepted = false
    }

    // if (intercepted) {
    //     children = children.flatMap(value => value)
    // } else {
    //     intercepted = true
    //
    //     children = children.flatMap(child => {
    //         if (Array.isArray(child)) {
    //             return child.map(value => {
    //                 if (typeof value === "string") {
    //                     return text2emoji(value)
    //                 }
    //
    //                 return value
    //             })
    //         } else if (typeof child === "string") {
    //             return text2emoji(child)
    //         }
    //
    //         return child
    //     })
    //
    //     intercepted = false
    // }

    const attrs: VRAttrs = Object.create(null)
    const events: VREvents = Object.create(null)
    const style: VRStyle = Object.create(null)

    let ref = undefined
    let dangerouslySetInnerHTML: boolean = false
    let doNotTouchMyChildren: boolean = false

    if (attributes) {
        for (let [k, v] of Object.entries(attributes)) {
            if (attrAliases.has(k)) {
                k = attrAliases.get(k)
            }

            const isComponentOrFragment = vrdom_isTagNameComponentOrFragment(tagName)
            let key = isComponentOrFragment ? k : k.toLowerCase()

            if (key.startsWith("on") && !isComponentOrFragment) {
                events[key.substring(2).toLowerCase()] = v
            } else if (k === "dangerouslySetInnerHTML") {
                dangerouslySetInnerHTML = v
                attrs["vr-dangerouslySetInnerHTML"] = true
            } else if (k === "doNotTouchMyChildren" && !isComponentOrFragment) {
                doNotTouchMyChildren = v
            } else if (key.startsWith("css-") && !isComponentOrFragment) {
                const styleKey = key.substring(4)
                style[styleKey] = v
            } else if (k === "showIf" && !isComponentOrFragment) {
                style.display = v ? undefined : "none"
            } else if (k === "hideIf" && !isComponentOrFragment) {
                style.display = v ? "none" : undefined
            } else if (key === "ref") {
                ref = v
            } else if (key === "style" && typeof v === "object" && !isComponentOrFragment) {
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

        dangerouslySetInnerHTML,
        doNotTouchMyChildren,
    })
}

export default vrdom_jsx