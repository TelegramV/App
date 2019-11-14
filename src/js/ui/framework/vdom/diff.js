// https://codeguida.com/post/1575

import render from "./render"

const zip = (xs, ys) => {
    const zipped = []
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]])
    }
    return zipped
}

const diffEvents = (oldEvents, newEvents) => {
    const patches = []

    // встановлення newAttrs
    for (const [k, v] of Object.entries(newEvents)) {
        patches.push($node => {
            $node.addEventListener(k, v)
            return $node
        })
    }

    // видалення attrs
    for (const k in oldEvents) {
        if (!(k in newEvents)) {
            patches.push($node => {
                $node.removeEventListener(k)
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

const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = []

    // встановлення newAttrs
    for (const [k, v] of Object.entries(newAttrs)) {
        patches.push($node => {
            $node.setAttribute(k, v)
            return $node
        })
    }

    // видалення attrs
    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            patches.push($node => {
                $node.removeAttribute(k)
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

const diffChildren = (oldVChildren, newVChildren) => {
    const childPatches = []
    oldVChildren.forEach((oldVChild, i) => {
        childPatches.push(diff(oldVChild, newVChildren[i]))
    })

    const additionalPatches = []
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(render(additionalVChild))
            return $node
        })
    }

    return $parent => {
        // оскільки childPatches очікують $child, а не $parent,
        // ми не можемо просто циклічно обійти масив і викликати patch($parent)
        for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
            patch($child)
        }

        for (const patch of additionalPatches) {
            patch($parent)
        }

        return $parent
    }
}

export const diff = (oldVTree, newVTree) => {
    if (!Array.isArray(oldVTree) && Array.isArray(newVTree)) {
        console.log("WHAT", oldVTree, newVTree)
    }

    // припустимо, що oldVTree не undefined!
    if (newVTree === undefined) {
        return $node => {
            $node.remove()
            // patch повинен повернути новий кореневий вузол
            // оскільки в даному випадку їх немає
            // ми просто повертаємо undefined.
            return undefined
        }
    }

    if ((typeof oldVTree !== "object" || typeof newVTree !== "object") &&
        (typeof oldVTree !== "function" || typeof newVTree !== "function")) {
        if (oldVTree !== newVTree) {
            // можуть бути 2 випадки:
            // 1.обидва дерева типу string і приймають різні значення
            // 2. одне з дерев — text node
            // а інше — elem node
            // у будь-якому випадку ми лише викличемо render(newVTree)!
            return $node => {
                const $newNode = render(newVTree)
                $node.replaceWith($newNode)
                return $newNode
            }
        } else {
            // означає, що обидва дерева типу string
            // і приймають однакові значення
            return $node => $node
        }
    }

    if (oldVTree.tagName !== newVTree.tagName) {
        // припустимо, що вони повністю різні
        // та не намагатимемось знайти відмінності
        // просто викличемо render для newVTree та встановимо його.
        return $node => {
            const $newNode = render(newVTree)
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

export default diff
