import PeersManager from "../peers/objects/PeersManager"

/**
 * @param {UpdateManager} manager
 * @param rawUpdate
 */
function processUpdatesCombined(manager, rawUpdate) {
    console.warn("processing updatesCombined is not properly implement now")

    PeersManager.fillPeersFromUpdate(rawUpdate)

    manager.State.date = rawUpdate.date

    for (const update of rawUpdate.updates) {
        manager.processUpdate(update._, update)
    }
}

export default processUpdatesCombined