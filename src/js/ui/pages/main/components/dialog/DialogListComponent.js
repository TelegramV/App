import DialogsManager from "../../../../../api/dialogs/DialogsManager"
import {DialogComponent} from "./DialogComponent"
import AppEvents from "../../../../../api/eventBus/AppEvents"
import Component from "../../../../v/vrdom/component"
import VRDOM from "../../../../v/vrdom"
import {ContextMenuManager} from "../../../../contextMenuManager";
import MTProto from "../../../../../mtproto";
import V from "../../../../v/VFramework";
import AppSelectedPeer from "../../../../reactive/SelectedPeer"
import {ConnectionStatusComponent} from "./ConnectionStatusComponent"
import Sortable from "sortablejs"

export class DialogListComponent extends Component {
    constructor(props) {
        super(props)

        this.reactive = {
            selectedPeer: AppSelectedPeer.Reactive.FireOnly
        }

        this.state = {
            isInLoadingMoreScroll: false,
        }

        this.elements = {
            $loader: undefined,
            $dialogsWrapper: undefined,
            $pinnedDialogs: undefined,
            $generalDialogs: undefined,
        }
    }

    h() {
        return (
            <div className="chatlist">
                <div className="toolbar">
                    <i className="btn-icon rp rps tgico-menu" onClick={ev => ContextMenuManager.openBelow([
                        {
                            icon: "newgroup",
                            title: "New group",
                            onClick: _ => {
                            }
                        },
                        {
                            icon: "newprivate",
                            title: "Contacts"
                        },
                        {
                            icon: "archive",
                            title: "Archived",
                            counter: 3
                        },
                        {
                            icon: "savedmessages",
                            title: "Saved",
                            onClick: _ => {
                                const p = MTProto.getAuthorizedUser().user.username ? `@${MTProto.getAuthorizedUser().user.username}` : `user.${MTProto.getAuthorizedUser().user.id}`

                                V.router.push("/", {
                                    queryParams: {
                                        p
                                    }
                                })
                            }
                        },
                        {
                            icon: "settings",
                            title: "Settings"
                        },
                        {
                            icon: "help",
                            title: "Help"
                        }
                    ], ev.target)}/>
                    <div className="search">
                        <div className="input-search">
                            <input type="text" placeholder="Search"/>
                            <span className="tgico tgico-search"/>
                        </div>
                    </div>
                </div>

                <ConnectionStatusComponent/>

                <div id="dialogsWrapper">
                    <div className="full-size-loader" id="loader">
                        <progress className="progress-circular big"/>
                    </div>

                    <div css-display="none" id="dialogsPinned" className="list pinned"/>
                    <div css-display="none" id="dialogs" className="list"/>
                </div>
            </div>
        )
    }

    mounted() {
        this.elements.$loader = this.$el.querySelector("#loader")
        this.elements.$dialogsWrapper = this.$el.querySelector("#dialogsWrapper")
        this.elements.$pinnedDialogs = this.elements.$dialogsWrapper.querySelector("#dialogsPinned")
        this.elements.$generalDialogs = this.elements.$dialogsWrapper.querySelector("#dialogs")

        this.elements.$dialogsWrapper.addEventListener("scroll", this._scrollHandler, {passive: true})

        Sortable.create(this.elements.$pinnedDialogs)

        AppEvents.Dialogs.subscribe("firstPage", event => {
            this.elements.$loader.style.display = "none"
            this.elements.$pinnedDialogs.style.display = ""
            this.elements.$generalDialogs.style.display = ""

            event.pinnedDialogs.forEach(dialog => {
                this._renderDialog(dialog, "append")
            })

            event.dialogs.forEach(dialog => {
                this._renderDialog(dialog, "append")
            })
        })

        AppEvents.Dialogs.subscribe("nextPage", event => {
            event.pinnedDialogs.forEach(dialog => {
                this._renderDialog(dialog, "append")
            })

            event.dialogs.forEach(dialog => {
                this._renderDialog(dialog, "append")
            })
        })

        AppEvents.Dialogs.subscribe("newFetched", event => {
            this._renderDialog(event.dialog, "prepend") // fixme: this should insert in proper place
        })

        AppEvents.Dialogs.subscribe("newMessage", event => {
            if (!V.mountedComponents.has(`dialog-${event.dialog.peer.type}-${event.dialog.peer.id}`)) {
                this._renderDialog(event.dialog, "prepend")
            }
        })

        //this._registerResizer()
    }

    reactiveChanged(key, value) {
        if (key === "selectedPeer") {
            if (value) {
                this.$el.classList.add("responsive-selected-chatlist")
            } else {
                this.$el.classList.remove("responsive-selected-chatlist")
            }
        }
    }

    /**
     * CRITICAL: this method must be called only once per unique dialog.
     *
     * @param {Dialog} dialog
     * @param {boolean|string} appendOrPrepend if `false` then it will try to find dialog to insert before
     * @private
     */
    _renderDialog(dialog, appendOrPrepend = false) {
        if (!this.elements.$pinnedDialogs || !this.elements.$generalDialogs) {
            console.error("$pinnedDialogs or $generalDialogs wasn't found on the page.")
            return
        }

        const newVDialog = <DialogComponent $pinned={this.elements.$pinnedDialogs}
                                            $general={this.elements.$generalDialogs}
                                            dialog={dialog}
                                            ref={`dialog-${dialog.peer.type}-${dialog.peer.id}`}/>

        if (appendOrPrepend === "append") {
            if (dialog.isPinned) {
                VRDOM.append(newVDialog, this.elements.$pinnedDialogs)
            } else {
                VRDOM.append(newVDialog, this.elements.$generalDialogs)
            }
        } else if (appendOrPrepend === "prepend") {
            if (dialog.isPinned) {
                VRDOM.prepend(newVDialog, this.elements.$pinnedDialogs)
            } else {
                VRDOM.prepend(newVDialog, this.elements.$generalDialogs)
            }
        } else {
            if (dialog.isPinned) {
                VRDOM.prepend(newVDialog, this.elements.$pinnedDialogs)
            } else {
                VRDOM.append(newVDialog, this.elements.$generalDialogs)
            }
        }
    }

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
            const computedSize = parseInt(getComputedStyle($element).width) + event.x - prevPosition

            if (computedSize < 150 && $searchElement) {
                $searchElement.classList.add("d-none")
            } else {
                $searchElement.classList.remove("d-none")
            }

            if (computedSize <= (DEFAULT_WIDTH - 2) && !sticked) {
                setmin()
            } else if (computedSize >= MIN_WIDTH) {
                setdef()
            }
        }

        const self = this

        $element.addEventListener("mousedown", function (event) {
            document.body.classList.add("grabbable")
            isMoving = true
            if (event.offsetX > 10 && isMoving) {
                prevPosition = event.x

                document.addEventListener("mousemove", resize, false)
            }
        }, false)

        document.addEventListener("mouseup", function () {
            document.body.classList.remove("grabbable")
            document.removeEventListener("mousemove", resize)
        }, false)

        $element.addEventListener("dblclick", function (event) {
            const w = parseInt(getComputedStyle($element).width)
            if (w < DEFAULT_WIDTH) {
                setdef()
            } else {
                setmin()
            }
        })
    }

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


    }
}