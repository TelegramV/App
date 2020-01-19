/**
 * @param {UpdateManager} manager
 * @param rawUpdate
 */
function processShortChatMessage(manager, rawUpdate) {
    // console.warn("processing updateShortChatMessage is not properly implement now", rawUpdate)

    manager.processUpdate(rawUpdate._, rawUpdate)
}

export default processShortChatMessage