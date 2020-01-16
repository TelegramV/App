import DialogsManager from "../../../../../api/dialogs/dialogsManager"
import {DialogComponent} from "./dialogComponent"
import DialogsStore from "../../../../../api/store/dialogsStore"
import AppEvents from "../../../../../api/eventBus/appEvents"
import Sortable from "sortablejs"
import AppSelectedDialog from "../../../../../api/dialogs/selectedDialog"
import AppFramework from "../../../../framework/framework"

/**
 * CRITICAL: Never rerender this component!!!
 */
export const DialogListComponent = AppFramework.createComponent({
    name: "dialog-list",
    reactive: {
        selectedDialog: AppSelectedDialog.Reactive.FireOnly
    },
    state: {
        // note: mb this is redundant, but we should be careful with this
        renderedDialogsIds: {
            pinned: new Set(),
            general: new Set(),
        },

        renderedDialogsElements: new Map([
            ["chat", new Map()],
            ["channel", new Map()],
            ["user", new Map()],
        ]),

        isInLoadingMoreScroll: false,

        previousSelectedDialog: undefined,

        generalSortable: undefined,
    },

    elements: {
        $loader: undefined,
        $dialogsWrapper: undefined,
        $pinnedDialogs: undefined,
        /**
         * @type {Element|Node}
         */
        $generalDialogs: undefined,
    },

    h() {
        return (
            <div className="chatlist">
                <div className="toolbar">
                    <div className="btn-icon rp rps tgico-menu"/>
                    <div className="search">
                        <div className="input-search">
                            <input type="text" placeholder="Search"/>
                            <span className="tgico tgico-search"/>
                        </div>
                    </div>
                </div>

                <div className="connecting" id="connecting_message">
                    <progress className="progress-circular"/>
                    <span>Waiting for network...</span>
                </div>

                <div id="dialogsWrapper" onScroll={this._scrollHandler}>
                    <div className="full-size-loader" id="loader">
                        <progress className="progress-circular big"/>
                    </div>

                    <div css-display="none" id="dialogsPinned" className="list pinned"/>
                    <div css-display="none" id="dialogs" className="list"/>
                </div>
            </div>
        )
    },

    mounted() {
        this.elements.$loader = this.$el.querySelector("#loader")
        this.elements.$dialogsWrapper = this.$el.querySelector("#dialogsWrapper")
        this.elements.$pinnedDialogs = this.elements.$dialogsWrapper.querySelector("#dialogsPinned")
        this.elements.$generalDialogs = this.elements.$dialogsWrapper.querySelector("#dialogs")

        DialogsManager.fetchDialogs({}).then(() => {
            this.elements.$loader.style.display = "none"
            this.elements.$pinnedDialogs.style.display = ""
            this.elements.$generalDialogs.style.display = ""

            Sortable.create(this.elements.$pinnedDialogs)
            // this.state.generalSortable = new Sortable(this.elements.$generalDialogs, {
            //     dataIdAttr: "data-date"
            // })
        })

        AppEvents.Dialogs.listenAny(this._handleDialogUpdates)
        AppEvents.Peers.listenAny(this._handlePeerUpdates)

        this._registerResizer()
    },

    changed(key, value) {
        if (key === "selectedDialog") {
            this._patchSelectedDialog()
        }
    },

    /**
     * @param {Dialog} dialog
     * @param {boolean|string} appendOrPrepend if `false` then it will try to find dialog to insert before
     * @private
     */
    _renderDialog(dialog, appendOrPrepend = false) {
        if (!this.elements.$pinnedDialogs || !this.elements.$generalDialogs) {
            throw new Error("$pinnedDialogs or $generalDialogs wasn't found on the page.")
        }

        const dialogElements = this.state.renderedDialogsElements.get(dialog.type)
        let $rendered = dialogElements.get(dialog.id) || false

        if ($rendered) {
            if (String(dialog.isPinned) !== $rendered.dataset.pinned) {

                if (dialog.isPinned) {
                    this.elements.$pinnedDialogs.prepend($rendered)
                } else {
                    const $foundRendered = this._findRenderedDialogToInsertBefore(dialog, $rendered)

                    if ($foundRendered) {
                        this.elements.$generalDialogs.insertBefore($rendered, $foundRendered)
                    }
                }

            } else if (parseInt($rendered.dataset.date) !== dialog.messages.last.date) {
                if (!dialog.isPinned) {
                    const $foundRendered = this._findRenderedDialogToInsertBefore(dialog, $rendered)

                    if ($foundRendered) {
                        this.elements.$generalDialogs.insertBefore($rendered, $foundRendered)
                    } else {
                        $rendered.remove()
                        dialogElements.delete(dialog.id)
                    }
                }
            }

            this._patchDialog.bind(this)(dialog, $rendered)
        } else {
            const newVDialog = <DialogComponent dialog={dialog}/>

            if (appendOrPrepend === "append") {
                if (dialog.isPinned) {
                    $rendered = VDOM.appendToReal(newVDialog, this.elements.$pinnedDialogs)
                    dialogElements.set(dialog.id, $rendered)
                } else {
                    $rendered = VDOM.appendToReal(newVDialog, this.elements.$generalDialogs)
                    dialogElements.set(dialog.id, $rendered)
                }
            } else if (appendOrPrepend === "prepend") {
                if (dialog.isPinned) {
                    $rendered = VDOM.prependToReal(newVDialog, this.elements.$pinnedDialogs)
                    dialogElements.set(dialog.id, $rendered)
                } else {
                    $rendered = VDOM.prependToReal(newVDialog, this.elements.$generalDialogs)
                    dialogElements.set(dialog.id, $rendered)
                }
            } else {
                if (dialog.isPinned) {
                    $rendered = VDOM.prependToReal(newVDialog, this.elements.$pinnedDialogs)
                    dialogElements.set(dialog.id, $rendered)
                } else {
                    const $foundRendered = this._findRenderedDialogToInsertBefore(dialog)

                    if ($foundRendered) {
                        $rendered = this.elements.$generalDialogs.insertBefore(VDOM.render(newVDialog), $foundRendered)
                        dialogElements.set(dialog.id, $rendered)
                    }
                }
            }
        }
    },

    /**
     * @param {Dialog} dialog
     * @param $ignore
     * @return {ChildNode|Element|Node|undefined}
     * @private
     */
    _findRenderedDialogToInsertBefore(dialog, $ignore = undefined) {
        const renderedDialogs = [
            ...this.state.renderedDialogsElements.get("user").values(),
            ...this.state.renderedDialogsElements.get("chat").values(),
            ...this.state.renderedDialogsElements.get("channel").values(),
        ]

        if (renderedDialogs.size === 0) {
            return undefined
        }

        let minDiff = 999999999999

        /**
         * @type {undefined|Element|Node}
         */
        let $dialog = undefined

        const lastMessageDate = parseInt(dialog.messages.last.date)

        renderedDialogs.forEach($rendered => {
            if ($rendered !== $ignore && $rendered.dataset.pinned !== "true") {
                const datasetDate = parseInt($rendered.dataset.date)
                const nextDiff = Math.abs(lastMessageDate - datasetDate)

                if (minDiff > nextDiff) {
                    minDiff = nextDiff
                    $dialog = $rendered
                }
            }
        })

        if (parseInt($dialog.dataset.date) > lastMessageDate && $dialog.nextSibling) {
            return $dialog.nextSibling
        }

        return $dialog  // fuuuuuuck
    },

    /**
     * Handles Dialog updates
     * @param event
     * @private
     */
    _handleDialogUpdates(event) {
        switch (event.type) {
            case "updateMany":
                event.pinnedDialogs.forEach(dialog => {
                    this._renderDialog(dialog, "append")
                })

                event.dialogs.forEach(dialog => {
                    this._renderDialog(dialog, "append")
                })

                break

            case "newMessage":
                this._renderDialog(event.dialog)

                break

            case "updateSingle":
                this._renderDialog(event.dialog)

                break

            case "updateDraftMessage":
                this._renderDialog(event.dialog)

                break

            case "updateReadHistoryInbox":
                this._patchDialog(event.dialog)

                break

            case "readHistory":
                this._patchDialog(event.dialog)

                break

            case "updateReadHistoryOutbox":
                this._patchDialog(event.dialog)

                break

            case "updateReadChannelInbox":
                this._patchDialog(event.dialog)

                break

            case "updateReadChannelOutbox":
                this._patchDialog(event.dialog)

                break

            case "updatePinned":
                this._renderDialog(event.dialog)

                break

        }
    },

    _patchDialog(dialog, $dialog = undefined) {
        if (!$dialog) {
            const dialogElements = this.state.renderedDialogsElements.get(dialog.type)
            $dialog = dialogElements.get(dialog.id) || false

            if (!$dialog) {
                return
            }
        }

        VDOM.patchReal($dialog, <DialogComponent dialog={dialog}/>)
    },

    _patchSelectedDialog() {
        if (this.reactive.selectedDialog) {
            if (AppSelectedDialog.PreviousDialog) {
                this._patchDialog(AppSelectedDialog.PreviousDialog)
            }

            this._patchDialog(this.reactive.selectedDialog)
        }
    },

    /**
     * Handles Peer updates
     * @param event
     * @private
     */
    _handlePeerUpdates(event) {
        const dialog = DialogsStore.get(event.peer.type, event.peer.id)

        if (dialog) {
            if (event.type === "updatePhoto" || event.type === "updatePhotoSmall") {
                this._patchDialog(dialog)
            } else if (event.type === "updateUserStatus") {
                this._patchDialog(dialog)
            }
        }
    },

    /**
     * Handles dialogs scroll. If at the bottom, then gets next page of dialogs.
     * @param event
     * @private
     */
    _scrollHandler(event) {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop && !this.state.isInLoadingMoreScroll) {
            this.state.isInLoadingMoreScroll = true

            console.log("fetching next page")

            DialogsManager.fetchNextPage({}).then(() => {
                this.state.isInLoadingMoreScroll = false
            })
        }
    },

    /**
     * Makes the sidebar resizeable.
     * TODO: mb will be better to have this in another file
     * @private
     */
    _registerResizer() {
        const $element = this.$el
        const MIN_WIDTH = 90
        const DEFAULT_WIDTH = 422

        let sticked = false
        let prevPosition = $element.offsetX
        let isMoving = false

        const $connectingMessageText = $element.querySelector("#connecting_message>span")
        const $searchElement = $element.querySelector(".search")

        const setmin = () => {
            sticked = true
            $element.style.width = `${MIN_WIDTH}px`
            $searchElement.classList.add("d-none")
            $connectingMessageText.classList.add("d-none")
        }

        const setdef = () => {
            sticked = false
            $element.style.width = `${DEFAULT_WIDTH}px`
            $searchElement.classList.remove("d-none")
            $connectingMessageText.classList.remove("d-none")
        }

        const resize = event => {
            if (this.state.renderedDialogsElements.size > 50) {
                setmin()
            } else {
                const computedSize = parseInt(getComputedStyle($element).width) + event.x - prevPosition

                if (computedSize < 150 && $searchElement) {
                    $searchElement.classList.add("d-none")
                } else {
                    $searchElement.classList.remove("d-none")
                }

                if (computedSize <= (MIN_WIDTH + 20) && !sticked) {
                    setmin()
                    prevPosition = event.x
                } else if (computedSize >= MIN_WIDTH) {
                    sticked = false
                    $element.style.width = `${computedSize}px`
                    prevPosition = event.x
                    $searchElement.classList.remove("d-none")
                    $connectingMessageText.classList.remove("d-none")
                }
            }
        }

        $element.addEventListener("mousedown", function (event) {
            isMoving = true
            if (event.offsetX > 10 && isMoving) {
                prevPosition = event.x

                document.addEventListener("mousemove", resize, false)
            }
        }, false)

        $element.addEventListener("dblclick", function (event) {
            const w = parseInt(getComputedStyle($element).width)
            if (w < DEFAULT_WIDTH) {
                setdef()
            } else {
                setmin()
            }
        })

        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", resize)
        }, false)
    }
})