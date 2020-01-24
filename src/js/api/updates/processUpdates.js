import PeersManager from "../peers/PeersManager"

/**
 * @param {UpdateManager} manager
 * @param rawUpdate
 */
function processUpdates(manager, rawUpdate) {
    // console.log("got updates", rawUpdate)
    rawUpdate.users.forEach(rawUser => PeersManager.setFromRawAndFire(rawUser))
    rawUpdate.chats.forEach(rawChat => PeersManager.setFromRawAndFire(rawChat))

    manager.State.date = rawUpdate.date

    for (const update of rawUpdate.updates) {
        manager.processUpdate(update._, update)
    }
}

export default processUpdates