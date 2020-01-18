/**
 * @param {UpdateManager} manager
 * @param rawUpdate
 */
function processShortMessage(manager, rawUpdate) {
    console.warn("processing updateShortMessage is not properly implement now")

    manager.processUpdate(rawUpdate._, rawUpdate)
}

export default processShortMessage