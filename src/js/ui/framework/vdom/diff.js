import VDOM from "./index"

function zip(xs, ys) {
    const zipped = []
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]])
    }
    return zipped
}

function diffEvents(oldEvents, newEvents) {
    const patches = []

    for (const [k, v] of Object.entries(newEvents)) {
        patches.push($node => {
            $node.addEventListener(k, v)
            return $node
        })
    }

    for (const [k, v] of Object.entries(oldEvents)) {
        patches.push($node => {
            $node.removeEventListener(k, v)
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

function diffChildren(oldVChildren, newVChildren) {
    const childPatches = []
    oldVChildren.forEach((oldVChild, i) => {
        childPatches.push(diff(oldVChild, newVChildren[i]))
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

export function vdom_diff(oldVTree, newVTree) {
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

    if (typeof oldVTree === "string" || typeof oldVTree === "number" || typeof newVTree === "string" || typeof newVTree === "number") {

        console.log(oldVTree, newVTree)

        if (oldVTree !== newVTree) {
            return $node => {
                const $newNode = VDOM.render(newVTree)
                $node.replaceWith($newNode)
                return $newNode
            }
        } else {
            return $node => $node
        }
    }

    if (typeof oldVTree.tagName === "object" && typeof newVTree.tagName === "object") {
        oldVTree = oldVTree.tagName.h()
        newVTree = newVTree.tagName.h()
    }

    if (oldVTree.tagName !== newVTree.tagName || (newVTree.attrs.hasOwnProperty("replaceWith") && newVTree.attrs.replaceWith)) {
        return $node => {
            const $newNode = VDOM.render(newVTree)
            $node.replaceWith($newNode)
            return $newNode
        }
    }

    const patchAttrs = diffAttrs(oldVTree.attrs, newVTree.attrs)
    const patchEvents = diffEvents(oldVTree.events, newVTree.events)
    const patchChildren = diffChildren(oldVTree.children, newVTree.children)

    return $node => {
        patchAttrs($node)
        patchEvents($node)
        patchChildren($node)
        return $node
    }
}

export default vdom_diff
