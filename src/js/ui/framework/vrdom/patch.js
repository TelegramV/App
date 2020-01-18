import {ComponentVRNode} from "./componentVRNode"
import {VRNode} from "./VRNode"
import AppFramework from "../framework"
import vrdom_mount from "./mount"
import vrdom_append from "./appendChild"
import Component from "./component"

/**
 * @param {Element|Node} $node
 * @param {Map} newEvents
 */
function patchEvents($node, newEvents) {
    for (const [k, v] of newEvents.entries()) {
        // todo: fix this thing
        $node.removeEventListener(k, v)
    }

    for (const [k, v] of newEvents.entries()) {
        $node.addEventListener(k, v)
    }
}

/**
 * @param {Element} $node
 * @param {Object} newAttrs
 */
function patchAttrs($node, newAttrs) {
    const oldAttrs = $node.attributes

    for (const [k, v] of Object.entries(newAttrs)) {
        if ($node.nodeType !== Node.TEXT_NODE) {
            const nv = Array.isArray(v) ? v.join(" ") : v

            if ($node.getAttribute(k) !== nv) {
                $node.setAttribute(k, nv)
            }
        }
    }

    for (const k of oldAttrs) {
        if (!newAttrs.hasOwnProperty(k)) {
            if ($node.nodeType !== Node.TEXT_NODE) {
                $node.removeAttribute(k)
            }
        }
    }
}


/**
 * May be bugs!! Idk now.
 *
 * @param $parent
 * @param {NodeListOf<ChildNode>} $children
 * @param newVChildren
 */
function patchChildren($parent, $children, newVChildren) {
    $children.forEach(($oldChild, i) => {
        vrdom_patch($oldChild, newVChildren[i])
    })

    for (const additionalVChild of newVChildren.slice($children.length)) {
        vrdom_append(additionalVChild, $parent)
    }
}

/**
 *
 * @param {HTMLElement|Node|Text} $node
 * @param dangerouslySetInnerHTML
 */
function patchDangerouslySetInnerHTML($node, dangerouslySetInnerHTML) {
    if ($node.getAttribute("dangerouslySetInnerHTML") === dangerouslySetInnerHTML) {
        return $node
    } else {
        $node.innerHTML = dangerouslySetInnerHTML
        return $node
    }
}

/**
 * @param $node
 * @param {ComponentVRNode} componentVNode
 */
function patchComponentVNode($node, componentVNode) {
    //
}

/**
 * @param {VRNode} vRNode
 */
function deepDeleteComponents(vRNode) {
    for (const child of vRNode.children) {
        // console.log("removing child", child)
        if (child instanceof ComponentVRNode) {
            console.error("cannot remove plain component")
        } else if (vRNode instanceof Component) {
            vRNode.__delete()

            deepDeleteComponents(vRNode.children)
        }
    }
}

/**
 * @param {Element[]|Node[]|NodeListOf<ChildNode>} $childNodes
 */
function deepDeleteRealNodeComponents($childNodes) {
    for (const $child of $childNodes) {
        if ($child.nodeType !== Node.TEXT_NODE) {
            if ($child.hasAttribute("data-component-id")) {

                const component = AppFramework.mountedComponents.get($child.getAttribute("data-component-id"))

                if (component) {
                    deepDeleteRealNodeComponents($child.childNodes)
                    component.__delete()
                } else {
                    deepDeleteRealNodeComponents($child.childNodes)
                }

            } else {
                deepDeleteRealNodeComponents($child.childNodes)
            }
        }
    }
}

function diffProps(oldProps, newProps) {
    const oldEntries = Object.entries(oldProps)
    const newEntries = Object.entries(newProps)

    if (oldEntries.length !== newEntries.length) {
        return true
    }

    for (const [newK, newV] of newV) {
        if (oldProps[newK] !== newV) {
            return true
        } else if (typeof oldProps[newK] === "object") {
            return true
        }
    }

    return false
}

/**
 * @param {HTMLElement|Node|Text} $node
 * @param {VRNode|ComponentVRNode} newVNode
 */
function vrdom_patch($node, newVNode) {
    if (newVNode instanceof ComponentVRNode) {
        // console.log("[patch] component patch")

        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(newVNode, $node)
        }

        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch component] $node component")

            const mounted = AppFramework.mountedComponents.get($node.getAttribute("data-component-id"))

            if (mounted) {
                if (!mounted.__.patchingSelf) {
                    mounted.props = newVNode.props
                    mounted.slot = newVNode.slot

                    return mounted.__patch()
                }
            } else {
                return vrdom_mount(newVNode, $node)
            }
        } else {
            return vrdom_mount(newVNode, $node)
        }

    } else if (newVNode instanceof VRNode) {
        // console.log("[patch] node patch")

        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(newVNode, $node)
        }

        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch node] $node component")

            const mounted = AppFramework.mountedComponents.get($node.getAttribute("data-component-id"))

            if (mounted) {

                if (!mounted.__.patchingSelf) {
                    deepDeleteRealNodeComponents($node.childNodes)
                    return mounted.__delete()
                }

            } else {
                return vrdom_mount(newVNode, $node)
            }
        }

        if ($node.tagName.toLowerCase() !== newVNode.tagName) {
            return vrdom_mount(newVNode, $node)
        }

        patchAttrs($node, newVNode.attrs)
        patchEvents($node, newVNode.events)

        if (newVNode.dangerouslySetInnerHTML !== false) {
            patchDangerouslySetInnerHTML($node, newVNode.dangerouslySetInnerHTML)
        } else {
            patchChildren($node, $node.childNodes, newVNode.children)
        }

        return $node

    } else if (newVNode === undefined) {
        // console.log("[patch] undefined")

        if ($node.nodeType === Node.TEXT_NODE) {
            $node.remove()
            return undefined
        }

        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch undefined] $node component")

            const component = AppFramework.mountedComponents.get($node.getAttribute("data-component-id"))

            if (component) {
                component.__delete()
            } else {
                console.warn("component was not found")
            }

        } else {
            $node.remove()
        }

        return undefined

    } else {

        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(newVNode, $node)
        }

        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch undefined] $node unexpected")

            const component = AppFramework.mountedComponents.get($node.getAttribute("data-component-id"))

            if (component) {
                component.__delete()
            } else {
                console.warn("component was not found")
            }

        } else {
            return vrdom_mount(newVNode, $node)
        }

    }
}

export default vrdom_patch