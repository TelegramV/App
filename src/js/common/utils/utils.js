export function arrayDelete(array, value) {
    const index = array.findIndex(v => v === value)
    if (index >= 0) {
        delete array[index]
    }
}
