export function arrayDelete(array, value) {
    const index = array.findIndex(v => v === value)

    if (index > -1) {
        array.splice(index, 1)

        return index
    }

    return false
}

export function arrayDeleteCallback(array, callback) {
    const index = array.findIndex(v => callback(v))

    if (index > -1) {
        array.splice(index, 1)

        return index
    }

    return false
}

export function isEquivalent(a, b) {
    const aProps = Object.getOwnPropertyNames(a)
    const bProps = Object.getOwnPropertyNames(b)

    if (aProps.length !== bProps.length) {
        return false
    }

    for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i]

        if (a[propName] !== b[propName]) {
            return false
        }
    }

    return true
}
