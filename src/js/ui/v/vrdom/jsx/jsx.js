import type {VRAttrs, VREvents, VRNodeProps, VRTagName} from "../types/types"
import VRNode from "../VRNode"
import attrAliases from "./attrAliases"
import attrProcessors from "./attrProcessors/attrProcessors"
import vrdom_createElement from "../createElement"
import VRDOM from "../VRDOM"

/**
 * JSX Translator
 *
 * @param tagName
 * @param attributes
 * @param children
 */
function vrdom_jsx(tagName: VRTagName, attributes: VRAttrs, ...children: Array<VRNode | VRNodeProps>) {
    if (tagName === VRDOM.Fragment) {
        throw new Error("fragments are not implemented")
    }

    children = children.flat(Infinity)

    const attrs: VRAttrs = Object.create(null)
    const events: VREvents = new Map()

    let ref = undefined
    let dangerouslySetInnerHTML: boolean = false

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            let key = typeof tagName === "function" ? k : k.toLowerCase()

            if (key.startsWith("on") && typeof tagName !== "function") {
                events.set(key.substring(2).toLowerCase(), v)
            } else if (key === "dangerouslySetInnerHTML" || key === "dangerouslysetinnerhtml") {
                // $ignore
                dangerouslySetInnerHTML = v
                attrs["f-dsil"] = true
            } else if (key === "ref") {
                ref = v
                attrs["ref"] = v // legacy components support
            } else if (key.startsWith("css-")) {
                const styleKey = key.substring(4)

                if (attrs.style) {
                    attrs.style += `;${styleKey}: ${v};`
                } else if (attributes.style) {
                    attrs.style = `${attributes.style};${styleKey}: ${v};`
                    delete attributes["style"]
                } else {
                    attrs.style = `${styleKey}: ${v};`
                }
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
        }
    }

    return vrdom_createElement(tagName, {
        attrs,
        events,
        // $ignore
        children,
        ref,

        dangerouslySetInnerHTML
    })
}

export default vrdom_jsx