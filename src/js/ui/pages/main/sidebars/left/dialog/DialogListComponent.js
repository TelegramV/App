import DialogsManager from "../../../../../../api/dialogs/DialogsManager"
import {DialogComponent} from "./DialogComponent"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import VRDOM from "../../../../../v/vrdom/VRDOM"
import {ContextMenuManager} from "../../../../../contextMenuManager";
import MTProto from "../../../../../../mtproto/external";
import V from "../../../../../v/VFramework";
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {ConnectionStatusComponent} from "./ConnectionStatusComponent"
import Sortable from "sortablejs"
import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import {LeftBarComponent} from "../LeftBarComponent"
import UIEvents from "../../../../../eventBus/UIEvents"

export class DialogListComponent extends LeftBarComponent {

    barName = "dialogs"
    barVisible = true

    useProxyState = false

    isLoadingMore = false

    loaderRef = VComponent.createRef()
    dialogsWrapperRef = VComponent.createRef()
    pinnedDialogsRef = VComponent.createRef()
    generalDialogsRef = VComponent.createRef()

    constructor(props) {
        super(props)

        this.callbacks = {
            selectedPeer: AppSelectedPeer.Reactive.FireOnly
        }
    }

    h() {
        return (
            <div className="chatlist sidebar">
                <div className="toolbar">
                    <i className="btn-icon rp rps tgico-menu" onClick={ev => {
                        if (ev.currentTarget.classList.contains("back")) return true; //Button currently in back state
                        ContextMenuManager.openBelow([
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
                                title: "Settings",
                                onClick: _ => {
                                    UIEvents.LeftSidebar.fire("show", {
                                        barName: "settings"
                                    })
                                    // Settings.open();
                                }
                            },
                            {
                                icon: "help",
                                title: "Help"
                            }
                        ], ev.target)
                    }}/>
                    <div className="search">
                        <div className="input-search">
                            <input type="text" placeholder="Search" onFocus={this.openSearch}/>
                            <span className="tgico tgico-search"/>
                        </div>
                    </div>
                </div>

                <ConnectionStatusComponent/>

                <div ref={this.dialogsWrapperRef} id="dialogsWrapper" class="scrollable">
                    <div ref={this.loaderRef} className="full-size-loader" id="loader">
                        <progress className="progress-circular big"/>
                    </div>

                    <div ref={this.pinnedDialogsRef} id="dialogsPinned" className="list pinned hidden"/>
                    <div ref={this.generalDialogsRef} id="dialogs" className="list hidden"/>
                </div>
            </div>
        )
    }

    mounted() {
        function onIntersection(entries) {
            entries.forEach(entry => {
                entry.target.style.opacity = entry.intersectionRatio > 0 ? 1 : 0
            })
        }

        this.intersectionObserver = new IntersectionObserver(onIntersection, {
            root: this.dialogsWrapperRef.$el,
            rootMargin: "250px",
            threshold: 1.0
        })

        this.dialogsWrapperRef.$el.addEventListener("scroll", this._scrollHandler, {passive: true})

        Sortable.create(this.pinnedDialogsRef.$el)

        // this._registerResizer()
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.Dialogs)
            .on("firstPage", this.onFirstPageUpdate)
            .on("nextPage", this.onNextPageUpdate)
            .on("newFetched", this.onNewFetchedUpdate)
            .on("newMessage", this.onNewMessageUpdate)
    }

    onFirstPageUpdate = event => {
        this.loaderRef.hide()
        this.pinnedDialogsRef.show()
        this.generalDialogsRef.show()

        event.dialogs.forEach(dialog => {
            this._renderDialog(dialog, "append")
        })
    }

    onNextPageUpdate = event => {
        event.dialogs.forEach(dialog => {
            this._renderDialog(dialog, "append")
        })
    }

    onNewFetchedUpdate = event => {
        this._renderDialog(event.dialog, "prepend") // fixme: this should insert in proper place
    }

    onNewMessageUpdate = event => {
        // dirty check, we must rewrite this
        if (!V.mountedComponents.has(`dialog-${event.dialog.peer.type}-${event.dialog.peer.id}`)) {
            this._renderDialog(event.dialog, "prepend")
        }
    }

    callbackChanged(key: string, value: *) {
        if (key === "selectedPeer") {
            if (value) {
                this.$el.classList.add("responsive-selected-chatlist")
            } else {
                this.$el.classList.remove("responsive-selected-chatlist")
            }
        }
    }

    openSearch = () => {

        // dude use ref pls

        let icon = this.$el.querySelector(".toolbar .btn-icon");
        icon.classList.add("back");
        icon.addEventListener("click", this._searchBackClick);

        UIEvents.LeftSidebar.fire("show", {
            barName: "search"
        })
    }

    // навіщо ж так костильно(
    _searchBackClick = (ev) => {
        let icon = ev.currentTarget;
        UIEvents.LeftSidebar.fire("show", {
            barName: "dialogs"
        })
        icon.classList.remove("back");
        icon.removeEventListener("click", this._searchBackClick);
    }

    //Ми не ховаємось в тіні!!!
    barOnShow = () => {
    }
    barOnHide = () => {
    }

    /**
     * CRITICAL: this method must be called only once per unique dialog.
     *
     * @param {Dialog} dialog
     * @param {boolean|string} appendOrPrepend if `false` then it will try to find dialog to insert before
     * @private
     */
    _renderDialog = (dialog, appendOrPrepend = false) => {
        // if (dialog.folderId === 1) {
        //     return // put it to archived
        // }

        if (!this.pinnedDialogsRef.$el || !this.generalDialogsRef.$el) {
            console.error("$pinnedDialogs or $generalDialogs wasn't found on the page.")
            return
        }

        const newVDialog = <DialogComponent $pinned={this.pinnedDialogsRef.$el}
                                            $general={this.generalDialogsRef.$el}
                                            dialog={dialog}/>

        if (appendOrPrepend === "append") {
            if (dialog.isPinned) {
                this.intersectionObserver.observe(VRDOM.append(newVDialog, this.pinnedDialogsRef.$el))
            } else {
                this.intersectionObserver.observe(VRDOM.append(newVDialog, this.generalDialogsRef.$el))
            }
        } else if (appendOrPrepend === "prepend") {
            if (dialog.isPinned) {
                this.intersectionObserver.observe(VRDOM.prepend(newVDialog, this.pinnedDialogsRef.$el))
            } else {
                this.intersectionObserver.observe(VRDOM.prepend(newVDialog, this.generalDialogsRef.$el))
            }
        } else {
            if (dialog.isPinned) {
                this.intersectionObserver.observe(VRDOM.prepend(newVDialog, this.pinnedDialogsRef.$el))
            } else {
                this.intersectionObserver.observe(VRDOM.append(newVDialog, this.generalDialogsRef.$el))
            }
        }
    }

    /**
     * Makes the sidebar resizeable.
     * TODO: mb will be better to have this in another file
     * @private
     */
    _registerResizer = () => {
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
    _scrollHandler = (event) => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop && !this.isLoadingMore) {
            this.isLoadingMore = true

            console.log("fetching next page")

            DialogsManager.fetchNextPage({}).then(() => {
                this.isLoadingMore = false
            })
        }


    }
}