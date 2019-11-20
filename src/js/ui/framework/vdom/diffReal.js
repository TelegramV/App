import VDOM from "./index"

function zip(xs, ys) {
    const zipped = []
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]])
    }
    return zipped
}

// todo: fix this thing
function diffEvents(newEvents) {
    const patches = []

    for (const [k, v] of Object.entries(newEvents)) {
        patches.push($node => {
            $node.removeEventListener(k, v)
            return $node
        })
    }

    for (const [k, v] of Object.entries(newEvents)) {
        patches.push($node => {
            $node.addEventListener(k, v)
            return $node
        })

    }

    return $node => {
        for (const patch of patches) {
            patch($node)
        }
        return $node
    }
}

/**
 *
 * @param {NamedNodeMap} oldAttrs
 * @param {object} newAttrs
 * @returns {function(*=): *}
 */
function diffAttrs(oldAttrs, newAttrs) {
    const patches = []

    for (const [k, v] of Object.entries(newAttrs)) {
        patches.push($node => {
            if ($node.nodeType !== Node.TEXT_NODE) {
                $node.setAttribute(k, v)
            }
            return $node
        })
    }

    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            patches.push($node => {
                if ($node.nodeType !== Node.TEXT_NODE) {
                    $node.removeAttribute(k)
                }
                return $node
            })
        }
    }

    return $node => {
        for (const patch of patches) {
            patch($node)
        }
        return $node
    }
}

/**
 *
 * @param {NodeListOf<ChildNode>} oldVChildren
 * @param newVChildren
 * @returns {function(*=): *}
 */
function diffChildren(oldVChildren, newVChildren) {
    const childPatches = []
    oldVChildren.forEach((oldVChild, i) => {
        childPatches.push(vdom_diffReal(oldVChild, newVChildren[i]))
    })

    const additionalPatches = []
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(VDOM.render(additionalVChild))
            return $node
        })
    }

    return $parent => {
        for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
            patch($child)
        }

        for (const patch of additionalPatches) {
            patch($parent)
        }

        return $parent
    }
}

/**
 *
 * @param {HTMLElement|Node|Text}$oldTree
 * @param dangerouslySetInnerHTML
 */
function diffDangerouslySetInnerHTML($oldTree, dangerouslySetInnerHTML) {
    if ($oldTree.getAttribute("dangerouslySetInnerHTML") === dangerouslySetInnerHTML) {
        return $node => $node
    } else {
        return $node => {
            $node.innerHTML = dangerouslySetInnerHTML
            return $node
        }
    }
}

/**
 *
 * @param {HTMLElement|Node|Text} $oldTree
 * @param newVTree
 * @returns {(function(*): undefined)|(function(*): (Text|HTMLElement))|(function(*=): *)|(function(*): *)}
 */
export function vdom_diffReal($oldTree, newVTree) {
    if (newVTree === undefined) {
        return $node => {
            $node.remove()
            return undefined
        }
    }

    if (typeof newVTree === "object" && !newVTree.tagName) {
        return $node => {
            const $newNode = VDOM.render(newVTree)
            $node.replaceWith($newNode)
            return $newNode
        }
    }

    console.log($oldTree, $oldTree.nodeType, newVTree)

    if ($oldTree.nodeType === Node.TEXT_NODE) {
        if ($oldTree.wholeText !== newVTree) {
            return $node => {
                const $newNode = VDOM.render(newVTree)
                $node.replaceWith($newNode)
                return $newNode
            }
        } else {
            return $node => $node
        }
    }

    if ($oldTree.tagName.toLowerCase() !== newVTree.tagName) {
        return $node => {
            const $newNode = VDOM.render(newVTree)
            $node.replaceWith($newNode)
            return $newNode
        }
    }

    const patchAttrs = diffAttrs($oldTree.attributes, newVTree.attrs)
    const patchEvents = diffEvents(newVTree.events)

    let patchChildren = null
    if (newVTree.dangerouslySetInnerHTML !== false) {
        console.warn($oldTree.childNodes, newVTree)
        patchChildren = diffDangerouslySetInnerHTML($oldTree, newVTree.dangerouslySetInnerHTML)
    } else {
        patchChildren = diffChildren($oldTree.childNodes, newVTree.children)
    }

    return $node => {
        patchAttrs($node)
        patchEvents($node)
        patchChildren($node)
        return $node
    }
}

export default vdom_diffReal
