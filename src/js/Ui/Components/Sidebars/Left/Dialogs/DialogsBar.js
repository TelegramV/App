import DialogsManager from "../../../../../Api/Dialogs/DialogsManager"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import LeftBarComponent from "../LeftBarComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput"
import VUI from "../../../../VUI"
import VApp from "../../../../../V/vapp"
import PeersStore from "../../../../../Api/Store/PeersStore"
import {BurgerAndBackComponent} from "../BurgerAndBackComponent";

export const DialogsBarContextMenu = (event, archivedCount) => {
    VUI.ContextMenu.openBelow([
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
                counter: archivedCount,
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
                const p = PeersStore.self().username ? `@${PeersStore.self().username}` : `user.${PeersStore.self().id}`

                VApp.router.push("/", {
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
    ], event.target)
}

export class DialogsBar extends LeftBarComponent {

    barName = "dialogs"
    barVisible = true

    Archived: ArchivedDialogListComponent

    isLoadingMore = false

    loaderRef = VComponent.createRef()
    dialogsWrapperRef = VComponent.createRef()

    render() {
        return (
            <div className="chatlist sidebar">
                {/*<div className="toolbar">*/}
                {/*    /!* TODO Must be shown if back button exists!*!/*/}
                {/*    <BurgerAndBackComponent isMain isNoFolders/>*/}

                {/*    /!*<i className={{"btn-icon rp rps tgico-menu": true, "hidden": FoldersManager.hasFolders()}} onClick={ev => {*!/*/}
                {/*    /!*    if (ev.currentTarget.classList.contains("back")) return true; //Button currently in back state*!/*/}
                {/*    /!*    DialogsBarContextMenu(ev, this.Archived && this.Archived.$el.childElementCount)*!/*/}
                {/*    /!*}}/>*!/*/}
                {/*    <div className="search">*/}
                {/*        <div className="input-search">*/}
                {/*            <VSimpleLazyInput type="text" placeholder="Search"*/}
                {/*                              onFocus={this.openSearch}*/}
                {/*                              onInput={this.onSearchInputCapture}*/}
                {/*                              lazyLevel={200}/>*/}
                {/*            <span className="tgico tgico-search"/>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*</div>*/}
                {/*<Folders/>*/}

                {/*<ConnectionStatusComponent/>*/}

                {/*<div ref={this.dialogsWrapperRef} id="dialogsWrapper" class={{"scrollable": true, "loading": true}}>*/}
                {/*    <div ref={this.loaderRef} className="full-size-loader" id="loader">*/}
                {/*        <progress className="progress-circular big"/>*/}
                {/*    </div>*/}

                {/*    <DialogListsComponent/>*/}
                {/*</div>*/}
                {/*<div class="new-chat rp rps" onClick={event => {*/}
                {/*    VUI.ContextMenu.openAbove([*/}
                {/*        {*/}
                {/*            icon: "channel",*/}
                {/*            title: "New Channel",*/}
                {/*            onClick: () => {*/}
                {/*                UIEvents.LeftSidebar.fire("show", {barName: "create-channel"})*/}
                {/*            }*/}
                {/*        },*/}
                {/*        {*/}
                {/*            icon: "group",*/}
                {/*            title: "New Group"*/}
                {/*        },*/}
                {/*        {*/}
                {/*            icon: "user",*/}
                {/*            title: "New Private Chat"*/}
                {/*        }*/}
                {/*    ], event.target)*/}
                {/*}}>*/}
                {/*    <i class="tgico tgico-newchat_filled"/>*/}
                {/*</div>*/}
            </div>
        )
    }

    barAfterHide = () => {

    }

    componentDidMount() {
        this.Archived = VComponent.getComponentById(`dialogs-archived-list`)
        this.dialogsWrapperRef.$el.addEventListener("scroll", this._scrollHandler, {passive: true})
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)

        E.bus(AppEvents.General)
            .on("selectFolder", this.onFolderSelect)
            .on("chat.select", this.onChatSelect)

        E.bus(UIEvents.LeftSidebar)
            .on("burger.backPressed", this.onBackPressed)
    }

    onDialogsGotMany = _ => {
        this.loaderRef.hide()
        this.dialogsWrapperRef.$el.classList.remove("loading")
    }

    onFolderSelect = _ => {
        this.dialogsWrapperRef.$el.scrollTop = 0
        if (this.$el.querySelector(".dialog-lists").clientHeight < this.$el.clientHeight) {
            this.loadNextPage()
        }
    }

    onChatSelect = _ => {
        if (AppSelectedChat.isSelected) {
            this.$el.classList.add("responsive-selected-chatlist")
        } else {
            this.$el.classList.remove("responsive-selected-chatlist")
        }
    }

    onBackPressed = (event) => {
        if (event.id === "search") {
            this._searchBackClick()
        }
    }

    openSearch = () => {
        console.warn("open")

        UIEvents.LeftSidebar.fire("burger.changeToBack", {
            id: "search"
        })

        UIEvents.LeftSidebar.fire("show", {
            barName: "search"
        })
    }

    _searchBackClick = (ev) => {
        UIEvents.LeftSidebar.fire("show", {
            barName: "dialogs"
        })
        UIEvents.LeftSidebar.fire("burger.changeToBurger", {})
    }

    //Ми не ховаємось в тіні!!!
    barOnShow = () => {
    }
    barOnHide = () => {
    }

    _scrollHandler = (event) => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop && !this.isLoadingMore) {
            this.loadNextPage()
        }
    }

    loadNextPage() {
        if (this.isLoadingMore) return
        this.isLoadingMore = true

        DialogsManager.fetchNextPage({}).then(() => {
            this.isLoadingMore = false
            // if (this.$el.querySelector(".dialog-lists").clientHeight < this.$el.clientHeight) {
            //     this.loadNextPage()
            // }
        })
    }

    onSearchInputCapture = event => {
        UIEvents.LeftSidebar.fire("searchInputUpdated", {
            string: event.target.value.trim()
        })
    }
}