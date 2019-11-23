import VDOM from "./index"

function zip(xs, ys) {
    const zipped = []
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]])
    }
    return zipped
}

// todo: fix this thing
function patchEvents($node, newEvents) {
    for (const [k, v] of Object.entries(newEvents)) {
        $node.removeEventListener(k, v)
    }

    for (const [k, v] of Object.entries(newEvents)) {
        $node.addEventListener(k, v)
    }
}

/**
 * @param $node
 * @param {NamedNodeMap} oldAttrs
 * @param {object} newAttrs
 * @returns {function(*=): *}
 */
function patchAttrs($node, oldAttrs, newAttrs) {
    for (const [k, v] of Object.entries(newAttrs)) {
        if ($node.nodeType !== Node.TEXT_NODE) {
            if (Array.isArray(v)) {
                $node.setAttribute(k, v.join(" "))
            } else {
                $node.setAttribute(k, v)
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
        $parent.appendChild(VDOM.render(additionalVChild))
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
export function vdom_patchReal($node, newVNode) {
    if (newVNode instanceof Node) {
        throw new Error("newVNode is an element of the real DOM and should be of virtual!")
    }

    if (newVNode === undefined) {
        $node.remove()
        return undefined
    }

    if (typeof newVNode === "object" && !newVNode.tagName) {
        const $newNode = VDOM.render(newVNode)
        $node.replaceWith($newNode)
        return $newNode
    }

    if ($node.nodeType === Node.TEXT_NODE) {
        if ($node.wholeText !== newVNode) {
            const $newNode = VDOM.render(newVNode)
            $node.replaceWith($newNode)
            return $newNode
        } else {
            return $node
        }
    }

    // named components check
    // if names are different then replace all tree
    if ($node.hasAttribute("data-component") || newVNode.attrs.hasOwnProperty("data-component")) {
        if ($node.getAttribute("data-component") !== newVNode.attrs["data-component"]) {
            const $newNode = VDOM.render(newVNode)
            $node.replaceWith($newNode)
            return $newNode
        }
    }

    // if tagNames are different then we replace all tree
    if ($node.tagName.toLowerCase() !== newVNode.tagName) {
        const $newNode = VDOM.render(newVNode)
        $node.replaceWith($newNode)
        return $newNode
    }

    patchAttrs($node, $node.attributes, newVNode.attrs)
    patchEvents($node, newVNode.events)

    if (newVNode.dangerouslySetInnerHTML !== false) {
        patchDangerouslySetInnerHTML($node, newVNode.dangerouslySetInnerHTML)
    } else {
        patchChildren($node, $node.childNodes, newVNode.children)
    }

    return $node
}

export default vdom_patchReal
