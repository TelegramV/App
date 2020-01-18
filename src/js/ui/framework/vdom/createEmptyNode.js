import vdom_isNamedComponent from "./check/isNamedComponent"

function vdom_createEmptyNode() {
    throw new Error("deprecated")
    const vNode = Object.create(null)

    vNode.__virtual = true
    vNode.tagName = "div"
    vNode.component = undefined
    vNode.attrs = {}
    vNode.events = new Map()
    vNode.children = []
    vNode.dangerouslySetInnerHTML = false
    vNode.renderIf = true
    vNode.customStyle = {}

    Object.defineProperty(vNode, "isComponent", {
        get() {
            return this.component !== undefined && vdom_isNamedComponent(this.component)
        }
    })

    return vNode
}


export default vdom_createEmptyNode