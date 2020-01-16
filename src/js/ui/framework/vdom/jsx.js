import vdom_h from "./h"
import VDOM from "./index"

const jsxAttributesMap = new Map([
    ["className", "class"],
    ["htmlFor", "for"],
])

const classAttrProcessor = value => {
    if (Array.isArray(value)) {
        return value.join(" ")
    } else if (typeof value === "object") {
        return Object.entries(value)
            .filter(attr => attr[1])
            .map(attr => attr[0])
            .join(" ")
    } else {
        return value
    }
}

const attrProcessorsMap = new Map([
    ["class", classAttrProcessor]
])

function removeEmpties(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === "") {
            array.splice(i, 1)
        }
    }
}

// function processChildrenIfs(children) {
//     let prevIf = undefined
//     for (let i = 0; i < children.length; i++) {
//         const vNode = children[i]
//         if (vdom_hasAttribute("if", vNode)) {
//             prevIf = !!vNode.attrs["if"]
//             vNode.renderIf = prevIf
//         } else if (vdom_hasAttribute("else", vNode) && prevIf !== undefined) {
//             vNode.renderIf = !prevIf
//             prevIf = undefined
//         }
//     }
// }

/**
 * translator (kostyl') for jsx
 *
 * @param tagName
 * @param attributes
 * @param children
 * @returns {*}
 */
function vdom_jsx(tagName, attributes, ...children) {
    if (tagName === VDOM.Fragment) {
        throw new Error("fragments are not implemented")
    }

    children = children.flat(Infinity)

    let attrs = {}
    let events = new Map()
    let dangerouslySetInnerHTML = false
    let renderIf = true
    // let customStyle = {}

    // removeEmpties(children)

    // processChildrenIfs(children)

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            let key = k

            if (k.startsWith("on")) {
                events.set(k.substring(2).toLowerCase(), v)
            } else if (k.startsWith("css-")) {
                const styleKey = k.substring(4)

                // customStyle[styleKey] = v

                if (attrs.style) {
                    attrs.style += `;${styleKey}: ${v};`
                } else if (attributes.style) {
                    attrs.style = `${attributes.style};${styleKey}: ${v};`
                    delete attributes["style"]
                } else {
                    attrs.style = `${styleKey}: ${v};`
                }
            } else if (k === "dangerouslySetInnerHTML") {
                dangerouslySetInnerHTML = v
                attrs[k] = v
            } else {
                if (jsxAttributesMap.has(k)) {
                    key = jsxAttributesMap.get(k)
                    attrs[key] = v
                } else {
                    attrs[k] = v
                }
            }

            if (attrProcessorsMap.has(key)) {
                attrs[key] = attrProcessorsMap.get(key)(v)
            }
        }
    }

    const vNode = Object.create(null)
    Object.assign(vNode, {attrs, events, children, dangerouslySetInnerHTML, renderIf})

    return vdom_h(tagName, vNode)
}

export default vdom_jsx
