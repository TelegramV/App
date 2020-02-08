/**
 * @param {UpdateManager} manager
 * @param rawUpdate
 */
function process_new_session_created(manager, rawUpdate) {
    if (manager.State.pts) {
        manager.defaultUpdatesProcessor.getDifference().then(() => {
            console.log("new_session_created processed (fetched difference)")
        })
    }
}

export default process_new_session_created