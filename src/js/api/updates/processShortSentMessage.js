/**
 * @param {UpdateManager} manager
 * @param rawUpdate
 */
function processShortSentMessage(manager, rawUpdate) {
    console.error("processing ShortSentMessage is not implemented")

    manager.processUpdate(rawUpdate._, rawUpdate)
}

export default processShortSentMessage