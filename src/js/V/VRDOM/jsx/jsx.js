/**
 * (c) Telegram V
 */

import type {VRAttrs, VREvents, VRNodeProps, VRTagName} from "../types/types"
import VRNode from "../VRNode"
import attrAliases from "./attrAliases"
import attrProcessors from "./attrProcessors/attrProcessors"
import vrdom_createElement from "../createElement"
import VRDOM from "../VRDOM"
import postAttrProcessor from "./attrProcessors/postAttrProcessor"

/**
 * JSX Translator
 *
 * @param tagName
 * @param attributes
 * @param children
 */
function vrdom_jsx(tagName: VRTagName, attributes: VRAttrs, ...children: Array<VRNode | VRNodeProps>) {
    if (tagName === VRDOM.Fragment) {
        console.warn("fragments are not fully implemented: patch is not working")
    }


    children = children.flat(Infinity)

    const attrs: VRAttrs = Object.create(null)
    const events: VREvents = new Map()

    let ref = undefined
    let dangerouslySetInnerHTML: boolean = false
    let style: Object = {}

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            let key = typeof tagName === "function" ? k : k.toLowerCase()

            if (key.startsWith("on") && typeof tagName !== "function") {
                events.set(key.substring(2).toLowerCase(), v)
            } else if (key === "dangerouslySetInnerHTML" || key === "dangerouslysetinnerhtml") {
                dangerouslySetInnerHTML = v
                attrs["vr-dangerouslySetInnerHTML"] = true
            } else if (key.startsWith("css-")) {
                const styleKey = key.substring(4)

                style[styleKey] = v
            } else if (key === "ref") {
                ref = v
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