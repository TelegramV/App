import VDOM from "./index"

const jsxAttributesMap = {
    className: "class",
    htmlFor: "for"
}

/**
 * translator (kostyl') for jsx
 *
 * @param tagName
 * @param attributes
 * @param children
 * @returns {any}
 */
export function vdom_jsx(tagName, attributes, ...children) {
    let attrs = {}
    let events = {}
    let options = {}
    let constructor = {}

    children = children.flat(Infinity)

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            if (k.startsWith("on")) {
                events[k.substring(2).toLowerCase()] = v
            } else if (k === "options") {
                options = Object.assign(options, v)
            } else if (k === "constructor") {
                constructor = Object.assign(options, v)
            } else {
                if (jsxAttributesMap.hasOwnProperty(k)) {
                    attrs[jsxAttributesMap[k]] = v
                } else {
                    attrs[k] = v
                }
            }
        }
    }

    return VDOM.h(tagName, {attrs, constructor, options, events, children})
}

export default vdom_jsx
