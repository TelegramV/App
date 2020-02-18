import PeersManager from "../Peers/Objects/PeersManager"

/**
 * @param {UpdateManager} manager
 * @param rawUpdate
 */
function processUpdates(manager, rawUpdate) {
    // console.log("got updates", rawUpdate)
    PeersManager.fillPeersFromUpdate(rawUpdate)

    manager.State.date = rawUpdate.date

    for (const update of rawUpdate.updates) {
        manager.processUpdate(update._, update)
    }
}

export default processUpdates