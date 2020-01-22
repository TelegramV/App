import vrdom_createElement from "./createElement"
import VRDOM from "./index"

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

/**
 * @param tagName
 * @param attributes
 * @param children
 * @return {VRNode}
 */
function vrdom_jsx(tagName, attributes, ...children) {
    if (tagName === VRDOM.Fragment) {
        throw new Error("fragments are not implemented")
    }

    children = children.flat(Infinity)

    const attrs = {}
    const events = new Map()
    let dangerouslySetInnerHTML = false

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            let key = typeof tagName === "function" ? k : k.toLowerCase()

            if (key.startsWith("on")) {
                events.set(key.substring(2).toLowerCase(), v)
            } else if (key === "dangerouslySetInnerHTML" || key === "dangerouslysetinnerhtml") {
                dangerouslySetInnerHTML = v
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
                if (jsxAttributesMap.has(k)) {
                    key = jsxAttributesMap.get(k)
                    attrs[key] = v
                } else {
                    attrs[key] = v
                }
            }

            if (attrProcessorsMap.has(key)) {
                attrs[key] = attrProcessorsMap.get(key)(v)
            }
        }
    }

    return vrdom_createElement(tagName, {
        attrs,
        events,
        children,

        dangerouslySetInnerHTML
    })
}

export default vrdom_jsx