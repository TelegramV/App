import {ComponentVRNode} from "./componentVRNode"
import {VRNode} from "./VRNode"
import AppFramework from "../framework"
import vrdom_mount from "./mount"
import vrdom_append from "./appendChild"

/**
 * @param {Element|Node} $node
 * @param {Map} newEvents
 */
function patchEvents($node, newEvents) {
    for (const [k, v] of newEvents.entries()) {
        $node[`on${k}`] = v
    }
}

/**
 * @param {Element} $node
 * @param {Object} newAttrs
 */
function patchAttrs($node, newAttrs) {
    if ($node.nodeType !== Node.TEXT_NODE) {
        for (const [k, v] of Object.entries(newAttrs)) {
            if (v === undefined) {
                $node.removeAttribute(k)
            } else if ($node.getAttribute(k) !== v) {
                $node.setAttribute(k, String(v))
            }
        }

        for (const name of $node.getAttributeNames()) {
            if (name !== "data-component-id" && !newAttrs.hasOwnProperty(name)) {
                $node.removeAttribute(name)
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

    if (newVChildren.length > $children.length) {
        for (let i = $children.length; i < newVChildren.length; i++) {
            vrdom_append(newVChildren[i], $parent)
        }
    } else if (newVChildren.length < $children.length) {
        Array.from($children.values()).slice(newVChildren.length).forEach($node => {
            vrdom_deepDeleteRealNodeInnerComponents($node)
            $node.remove()
        })
    }
}

/**
 *
 * @param {HTMLElement|Node|Text} $node
 * @param dangerouslySetInnerHTML
 */
function patchDangerouslySetInnerHTML($node, dangerouslySetInnerHTML) {
    // we should actually check diff here, but fuck it, do not use this thing
    $node.innerHTML = dangerouslySetInnerHTML
    return $node
}

/**
 * @param {Element|Node} $node
 */
export function vrdom_deepDeleteRealNodeInnerComponents($node) {
    while ($node.firstChild) {

        const $child = $node.firstChild

        if ($child.nodeType !== Node.TEXT_NODE) {
            if ($child.hasAttribute("data-component-id")) {

                const rawId = $child.getAttribute("data-component-id")
                const component = AppFramework.MountedComponents.get(rawId)

                if (component) {
                    component.__delete()
                } else {
                    vrdom_deepDeleteRealNodeInnerComponents($child)
                    $child.remove()
                }

            } else {
                vrdom_deepDeleteRealNodeInnerComponents($child)
                $child.remove()
            }
        } else {
            $child.remove()
        }

    }
}

/**
 * @param {Element|Node} $node
 */
export function vrdom_deepDeleteRealNode($node) {
    if ($node.hasAttribute("data-component-id")) {

        const rawId = $node.getAttribute("data-component-id")
        const component = AppFramework.MountedComponents.get(rawId)

        if (component) {
            component.__delete()
        } else {
            vrdom_deepDeleteRealNodeInnerComponents($node)
            $node.remove()
        }

    } else {
        $node.remove()
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

            const mounted = AppFramework.MountedComponents.get($node.getAttribute("data-component-id"))

            if (mounted) {
                if (!mounted.__.patchingItself) {
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

            const mounted = AppFramework.MountedComponents.get($node.getAttribute("data-component-id"))

            if (mounted) {

                if (!mounted.__.patchingItself) {
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

            const component = AppFramework.MountedComponents.get($node.getAttribute("data-component-id"))

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
            if ($node.textContent !== String(newVNode)) {
                return vrdom_mount(newVNode, $node)
            }

            return $node
        }

        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch undefined] $node unexpected")

            const component = AppFramework.MountedComponents.get($node.getAttribute("data-component-id"))

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