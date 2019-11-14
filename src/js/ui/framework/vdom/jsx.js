import {h} from "./h"

const jsxAttributesMap = {
    className: "class"
}

function flatArray(array) {
    if (!Array.isArray(array)) {
        return [array]
    }

    const res = []
    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i])) {
            res.concat(flatArray(array[i]))
        } else {
            res.push(array[i])
        }
    }
    return res
}

/**
 * translator (kostyl') for jsx
 *
 * @param tagName
 * @param attributes
 * @param children
 * @returns {any}
 */
export function jsx(tagName, attributes, ...children) {
    let attrs = {}
    let events = {}
    let options = {}
    let constructor = {}
    let htmlChild = false

    children = children.flat(Infinity)

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            if (k.startsWith("on")) {
                events[k.substring(2).toLowerCase()] = v
            } else if (k === "options") {
                options = Object.assign(options, v)
            } else if (k === "constructor") {
                constructor = Object.assign(options, v)
            } else if (k === "htmlChild") {
                htmlChild = Boolean(v)
            } else {
                if (jsxAttributesMap.hasOwnProperty(k)) {
                    attrs[jsxAttributesMap[k]] = v
                } else {
                    attrs[k] = v
                }
            }
        }
    }

    return h(tagName, {attrs, constructor, options, events, children, htmlChild,})
}

export default jsx