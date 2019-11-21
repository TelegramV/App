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
 *
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
 * @returns {function(*=): *}
 */
function patchChildren($parent, $children, newVChildren) {
    $children.forEach((oldVChild, i) => {
        vdom_patchReal(oldVChild, newVChildren[i])
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
 * @param {HTMLElement|Node|Text} $node
 * @param newVTree
 */
export function vdom_patchReal($node, newVTree) {
    if (newVTree === undefined) {
        return $node => {
            $node.remove()
            return undefined
        }
    }

    if (typeof newVTree === "object" && !newVTree.tagName) {
        const $newNode = VDOM.render(newVTree)
        $node.replaceWith($newNode)
        return $newNode
    }

    if ($node.nodeType === Node.TEXT_NODE) {
        if ($node.wholeText !== newVTree) {
            const $newNode = VDOM.render(newVTree)
            $node.replaceWith($newNode)
            return $newNode
        } else {
            return $node
        }
    }

    // if tagNames are different then we replace all tree
    if ($node.tagName.toLowerCase() !== newVTree.tagName) {
        const $newNode = VDOM.render(newVTree)
        $node.replaceWith($newNode)
        return $newNode
    }

    patchAttrs($node, $node.attributes, newVTree.attrs)
    patchEvents($node, newVTree.events)

    if (newVTree.dangerouslySetInnerHTML !== false) {
        console.warn($node.childNodes, newVTree)
        patchDangerouslySetInnerHTML($node, newVTree.dangerouslySetInnerHTML)
    } else {
        patchChildren($node, $node.childNodes, newVTree.children)
    }

    return $node
}

export default vdom_patchReal
