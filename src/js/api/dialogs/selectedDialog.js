import ReactiveCallback from "../../ui/framework/reactive/reactiveCallback"
import {AppFramework} from "../../ui/framework/framework"
import DialogsStore from "../store/dialogsStore"
import DialogsManager from "./dialogsManager"
import {Dialog} from "../dataObjects/dialog/dialog"

export function parseHashQuery() {
    const queryPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")

    if (queryPeer.length < 2) {
        throw Error("invalid peer")
    }

    return {type: queryPeer[0], id: parseInt(queryPeer[1])}
}

class SelectedDialog {
    /**
     * @param {Dialog} dialog
     */
    constructor({dialog = undefined}) {
        this._previousDialog = undefined
        this._dialog = dialog

        this._selectListeners = []

        AppFramework.Router.onQueryChange(queryParams => {
            this._previousDialog = this._dialog
            this._dialog = this.findFromQueryParams(queryParams)

            this._selectListeners.forEach(listener => {
                listener(this._dialog)
            })
        })
    }

    /**
     * @return {undefined|Dialog}
     * @constructor
     */
    get PreviousDialog() {
        return this._previousDialog
    }

    /**
     * @return {boolean}
     */
    get isSelected() {
        return this.Dialog instanceof Dialog
    }

    /**
     * @return {boolean}
     */
    get isNotSelected() {
        return !this.isSelected
    }

    /**
     * @return {Dialog}
     */
    get Dialog() {
        return this._dialog
    }

    /**
     * @return {{Default: Dialog, FireOnly: Dialog, PatchOnly: Dialog}}
     */
    get Reactive() {
        return ReactiveCallback(resolve => {
            this.listen(resolve)
            this._previousDialog = this._dialog
            this._dialog = this.findFromQueryParams(AppFramework.Router.activeRoute.queryParams)
            return this._dialog
        }, resolve => {
            this.shutUp(resolve)
        })
    }

    /**
     * @param {function(dialog: Dialog)} resolve
     */
    listen(resolve) {
        this._selectListeners.push(resolve)
    }

    /**
     * @param {function(dialog: Dialog)} resolve
     */
    shutUp(resolve) {
        const index = this._selectListeners.findIndex(value => value === resolve)

        if (index > -1) {
            this._selectListeners.splice(index, 1)
        } else {
            console.error("cannot find resolve")
        }
    }

    /**
     * @param queryParams
     * @return {Dialog|undefined|boolean}
     */
    findFromQueryParams(queryParams) {
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
     * Checks if the given dialog is selected.
     *
     * Warning: it checks directly by `===`!
     *
     * @param {Dialog} dialog
     * @return {boolean}
     */
    check(dialog) {
        if (!this._dialog || !dialog) {
            return false
        }

        return this.Dialog === dialog && this.Dialog.type === dialog.type && this.Dialog.id === dialog.id
    }
}

const AppSelectedDialog = new SelectedDialog({})

export default AppSelectedDialog