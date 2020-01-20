import vdom_isVNode from "./isVNode"

function vdom_hasAttribute(attrName, vNode) {
    throw new Error("deprecated")
    return vdom_isVNode(vNode) && attrName in vNode.attrs
}

export function vdom_attributeIndex(attrName, vNode) {
    throw new Error("deprecated")
    return vdom_isVNode(vNode) ? Object.keys(vNode.attrs).indexOf(attrName) : -1
}

export function vdom_removeAttribute(attrName, vNode) {
    throw new Error("deprecated")
    const index = vdom_attributeIndex(attrName, vNode)

    if (index > -1) {
        vNode.attrs.splice(index, 1)
    }
}

export default vdom_hasAttribute
