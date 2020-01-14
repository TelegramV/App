import vdom_h from "./h"
import vdom_hasAttribute from "./check/hasAttribute"

const jsxAttributesMap = new Map([
    ["className", "class"],
    ["htmlFor", "for"],
])

function removeEmpties(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === "") {
            array.splice(i, 1)
        }
    }
}

function processChildrenIfs(children) {
    let prevIf = undefined
    for (let i = 0; i < children.length; i++) {
        const vNode = children[i]
        if (vdom_hasAttribute("if", vNode)) {
            prevIf = !!vNode.attrs["if"]
            vNode.renderIf = prevIf
        } else if (vdom_hasAttribute("else", vNode) && prevIf !== undefined) {
            vNode.renderIf = !prevIf
            prevIf = undefined
        }
    }
}

/**
 * translator (kostyl') for jsx
 *
 * @param tagName
 * @param attributes
 * @param children
 * @returns {VNode}
 */
function vdom_jsx(tagName, attributes, ...children) {
    let attrs = {}
    let events = new Map()
    let dangerouslySetInnerHTML = false
    let renderIf = true

    // removeEmpties(children)
    children = children.flat(Infinity)

    processChildrenIfs(children)

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            if (k.startsWith("on")) {
                events.set(k.substring(2).toLowerCase(), v)
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
            } else if (k === "dangerouslySetInnerHTML") {
                dangerouslySetInnerHTML = v
                attrs[k] = v
            } else {
                if (jsxAttributesMap.has(k)) {
                    attrs[jsxAttributesMap.get(k)] = v
                } else {
                    attrs[k] = v
                }
            }
        }
    }

    return vdom_h(tagName, {attrs, events, children, dangerouslySetInnerHTML, renderIf})
}

export default vdom_jsx
