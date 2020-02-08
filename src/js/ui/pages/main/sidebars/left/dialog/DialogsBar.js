import DialogsManager from "../../../../../../api/dialogs/DialogsManager"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import {ContextMenuManager} from "../../../../../contextMenuManager";
import MTProto from "../../../../../../mtproto/external";
import VF from "../../../../../v/VFramework";
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {ConnectionStatusComponent} from "./ConnectionStatusComponent"
import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import {LeftBarComponent} from "../LeftBarComponent"
import UIEvents from "../../../../../eventBus/UIEvents"
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent"
import GeneralDialogListComponent from "./Lists/GeneralDialogListComponent"
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent"

export class DialogsBar extends LeftBarComponent {

    barName = "dialogs"
    barVisible = true

    Archived: ArchivedDialogListComponent

    useProxyState = false

    isLoadingMore = false

    loaderRef = VComponent.createRef()
    dialogsWrapperRef = VComponent.createRef()

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
                            () => {
                                return {
                                    icon: "archive",
                                    title: "Archived",
                                    counter: this.Archived && this.Archived.$el.childElementCount,
                                    onClick: _ => {
                                        UIEvents.LeftSidebar.fire("show", {
                                            barName: "archived"
                                        })
                                    }
                                }
                            },
                            {
                                icon: "savedmessages",
                                title: "Saved",
                                onClick: _ => {
                                    const p = MTProto.getAuthorizedUser().user.username ? `@${MTProto.getAuthorizedUser().user.username}` : `user.${MTProto.getAuthorizedUser().user.id}`

                                    VF.router.push("/", {
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

                    <PinnedDialogListComponent/>
                    <GeneralDialogListComponent/>
                </div>
                <div class="new-chat"><i class="tgico tgico-newchat_filled"/></div>
            </div>
        )
    }

    mounted() {
        this.Archived = VF.mountedComponents.get(`dialogs-archived-list`)
        this.dialogsWrapperRef.$el.addEventListener("scroll", this._scrollHandler, {passive: true})
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
    }

    onDialogsGotMany = _ => {
        this.loaderRef.hide()
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