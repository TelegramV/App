export function arrayDelete(array, value) {
    const index = array.findIndex(v => v === value)

    if (index > -1) {
        array.splice(index, 1)

        return true
    }

    return false
}

export function arrayDeleteCallback(array, callback) {
    const index = array.findIndex(v => callback(v))

    if (index > -1) {
        array.splice(index, 1)

        return true
    }

    return false
}