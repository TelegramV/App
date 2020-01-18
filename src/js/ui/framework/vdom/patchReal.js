import vdom_render from "./render"
import vdom_isVNode from "./check/isVNode"
import vdom_mount from "./mount"
import vdom_isNamedComponent from "./check/isNamedComponent"

// function patchStyles($node, newStyles) {
//     for (const [k, v] of Object.entries(newStyles)) {
//         if ($node.style[k] !== newStyles[k]) {
//             $node.style[k] = v
//         }
//     }
// }

function patchNamedComponent($node, component) {

}

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

    for (const k in oldAttrs) {
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
        vdom_patchReal($oldChild, newVChildren[i])
    })

    for (const additionalVChild of newVChildren.slice($children.length)) {
        $parent.appendChild(vdom_render(additionalVChild))
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
 * FIXME: fix bug in message voice template!!!
 *
 * @param {HTMLElement|Node|Text} $node
 * @param newVNode
 */
function vdom_patchReal($node, newVNode) {
    throw new Error("deprecated")
    if (newVNode instanceof Node) {
        throw new Error("newVNode is an element of the real DOM and should be of virtual.")
    }

    if (newVNode === undefined) {
        $node.remove()
        return undefined
    }

    if (typeof newVNode === "object" && !vdom_isVNode(newVNode)) {
        return vdom_mount(newVNode, $node)
    }

    if ($node.nodeType === Node.TEXT_NODE) {
        if (typeof newVNode === "object" || typeof newVNode === "function" || String($node.textContent) !== String(newVNode)) {
            return vdom_mount(newVNode, $node)
        } else {
            return $node
        }
    }

    if ($node.hasAttribute("data-component")) {
        if (vdom_isNamedComponent(newVNode)) {
            if (!newVNode.__.patchingSelf) {
                return newVNode.__patch()
            }
        } else if (newVNode.component) {
            if (!newVNode.component.__.patchingSelf) {
                return newVNode.component.__patch()
            }
        } else {
            deleteNamedComponentById($node.dataset["data-component"])
            return undefined
        }
    }

    // named components check
    // if names are different then replace all tree
    if ($node.hasAttribute("data-component") || newVNode.attrs.hasOwnProperty("data-component")) {
        if ($node.getAttribute("data-component") !== newVNode.attrs["data-component"]) {
            console.warn("patch diff components")
            return vdom_mount(newVNode, $node)
        }
    }

    // if tagNames are different then replace all tree
    if ($node.tagName.toLowerCase() !== newVNode.tagName) {
        return vdom_mount(newVNode, $node)
    }

    // patchStyles($node, newVNode.customStyle)
    patchAttrs($node, newVNode.attrs)
    patchEvents($node, newVNode.events)

    if (newVNode.dangerouslySetInnerHTML !== false) {
        patchDangerouslySetInnerHTML($node, newVNode.dangerouslySetInnerHTML)
    } else {
        patchChildren($node, $node.childNodes, newVNode.children)
    }

    return $node
}

export default vdom_patchReal
