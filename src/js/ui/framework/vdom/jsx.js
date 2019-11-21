import VDOM from "./index"

const jsxAttributesMap = {
    className: "class",
    htmlFor: "for"
}

function removeEmpties(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === "") {
            delete array[i]
        }
    }
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
    let dangerouslySetInnerHTML = false

    // removeEmpties(children)
    children = children.flat(Infinity)

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            if (k.startsWith("on")) {
                events[k.substring(2).toLowerCase()] = v
            } else if (k.startsWith("css-")) {
                const styleKey = k.substring(4)

                if (attrs.style) {
                    attrs.style += `;${styleKey}: ${v};`
                } else if (attributes.style) {
                    attrs.style = `${attributes.style};${styleKey}: ${v};`
                    delete attributes["style"]
                } else {
                    attrs.style = `${styleKey}: ${v};`
                }
            } else if (k === "options") {
                options = Object.assign(options, v)
            } else if (k === "dangerouslySetInnerHTML") {
                dangerouslySetInnerHTML = v
                attrs[k] = v
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

    return VDOM.h(tagName, {attrs, constructor, options, events, children, dangerouslySetInnerHTML})
}

export default vdom_jsx
