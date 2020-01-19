/**
 * @param {UpdateManager} manager
 * @param rawUpdate
 */
function processShort(manager, rawUpdate) {
    // console.warn("processing updateShort is not properly implement now", rawUpdate)

    manager.processUpdate(rawUpdate.update._, rawUpdate.update)
}

export default processShort