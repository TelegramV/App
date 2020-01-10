// todo: fix this thing
import vdom_render from "./render"
import vdom_isVNode from "./check/isVNode"
import vdom_mount from "./mount"

function patchEvents($node, newEvents) {
    for (const [k, v] of Object.entries(newEvents)) {
        $node.removeEventListener(k, v)
    }

    for (const [k, v] of Object.entries(newEvents)) {
        $node.addEventListener(k, v)
    }
}

/**
 * @param {Element} $node
 * @param {object} newAttrs
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
        if (!(k in newAttrs)) {
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

    if (typeof newVNode !== "object" && typeof newVNode !== "function") {
        if ($node.nodeType !== Node.TEXT_NODE || $node.wholeText !== newVNode) {
            return vdom_mount(newVNode, $node)
        }
    }

    if ($node.nodeType === Node.TEXT_NODE) {
        if ($node.wholeText !== newVNode) {
            return vdom_mount(newVNode, $node)
        } else {
            return $node
        }
    }

    // todo: uncomment this
    // named components check
    // if names are different then replace all tree
    // if ($node.hasAttribute("data-component") || newVNode.attrs["data-component"] !== undefined) {
    //     if ($node.getAttribute("data-component") !== newVNode.attrs["data-component"]) {
    //         return vdom_mount(newVNode, $node)
    //     }
    // }

    // if tagNames are different then replace all tree
    if ($node.tagName.toLowerCase() !== newVNode.tagName) {
        return vdom_mount(newVNode, $node)
    }

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
