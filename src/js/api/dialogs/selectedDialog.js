import ReactiveCallback from "../../ui/framework/reactive/reactiveCallback"
import {AppFramework} from "../../ui/framework/framework"
import DialogsStore from "../store/dialogsStore"
import DialogsManager from "./dialogsManager"
import {Dialog} from "../dataObjects/dialog/dialog"
import {arrayDelete} from "../../common/utils/utils"

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

        this._selectSubscribers = []

        this._Reactive = ReactiveCallback(resolve => {
            this.subscribe(resolve)
            this._previousDialog = this._dialog
            this._dialog = this.findFromQueryParams(AppFramework.Router.activeRoute.queryParams)
            return this._dialog
        }, resolve => {
            this.unsubscribe(resolve)
        })

        AppFramework.Router.onQueryChange(queryParams => {
            this._previousDialog = this._dialog
            this._dialog = this.findFromQueryParams(queryParams)

            this._selectSubscribers.forEach(listener => {
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
        return this._Reactive
    }

    /**
     * @param {function(dialog: Dialog)} resolve
     */
    subscribe(resolve) {
        this._selectSubscribers.push(resolve)
    }

    /**
     * @param {function(dialog: Dialog)} resolve
     */
    unsubscribe(resolve) {
        arrayDelete(this._selectSubscribers, resolve)
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