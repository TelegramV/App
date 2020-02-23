/**
 * @param {Object} prevObject
 * @param {Object} nextObject
 * @param {function(prev, next): boolean} comparator
 * @return {boolean|Object}
 */
const __diffObjects = (prevObject, nextObject, comparator) => {
    const diff = {}

    for (const [k, v] of Object.entries(nextObject)) {
        const oldV = prevObject[k]

        if (comparator) {
            if (comparator.call(null, oldV, v)) {
                diff[k] = v
            }
        } else if (oldV !== v) {
            diff[k] = v
        }
    }

    return Object.keys(diff).length > 0 ? diff : false
}

export default __diffObjects