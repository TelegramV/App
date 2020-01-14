import ReactiveCallback from "../framework/reactive/reactiveCallback"
import {AppFramework} from "../framework/framework"
import DialogsStore from "../../api/store/dialogsStore"
import DialogsManager from "../../api/dialogs/dialogsManager"

/**
 * @type {function(*)[]}
 */
const SelectedDialogListeners = []

/**
 * @type {Dialog|undefined}
 */
export let SelectedDialogObject = undefined


AppFramework.Router.onQueryChange(queryParams => {
    SelectedDialogObject = findFromQueryParams(queryParams)

    SelectedDialogListeners.forEach(u => {
        u(SelectedDialogObject)
    })
})


/**
 * @return {{id: number, type: string}}
 */
export function parseHashQuery() {
    const queryPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")

    if (queryPeer.length < 2) {
        throw Error("invalid peer")
    }

    return {type: queryPeer[0], id: parseInt(queryPeer[1])}
}

/**
 * @param queryParams
 * @return {Dialog|undefined|boolean}
 */
function findFromQueryParams(queryParams) {
    if (queryParams && queryParams.p) {

        if (queryParams.p.startsWith("@")) {
            return DialogsStore.getByUsername(queryParams.p.substring(1))
        } else {
            const queryPeer = parseHashQuery()
            return DialogsManager.find(queryPeer.type, queryPeer.id)
        }

    } else {
        return undefined
    }
}

/**
 * Updates dialog selected by hash
 *
 * @type {Dialog|{FireOnly: Dialog, PatchOnly: Dialog}}
 */
const ReactiveSelectedDialog = ReactiveCallback(resolve => {
    SelectedDialogListeners.push(resolve)
    SelectedDialogObject = findFromQueryParams(AppFramework.Router.activeRoute.queryParams)
    return SelectedDialogObject
})

export default ReactiveSelectedDialog