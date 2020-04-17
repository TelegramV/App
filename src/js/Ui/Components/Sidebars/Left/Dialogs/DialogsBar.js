import DialogsManager from "../../../../../Api/Dialogs/DialogsManager"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import MTProto from "../../../../../MTProto/external";
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import ConnectionStatusComponent from "./ConnectionStatusComponent"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import LeftBarComponent from "../LeftBarComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent"
import GeneralDialogListComponent from "./Lists/GeneralDialogListComponent"
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent"
import LazyInput from "../../../Elements/LazyInput"
import VUI from "../../../../VUI"
import VApp from "../../../../../V/vapp"
import {Folders} from "./Folders";

const contextMenu = (event, archivedCount) => {
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
                const p = MTProto.getAuthorizedUser().user.username ? `@${MTProto.getAuthorizedUser().user.username}` : `user.${MTProto.getAuthorizedUser().user.id}`

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
                <div className="toolbar">
                    <i className="btn-icon rp rps tgico-menu" onClick={ev => {
                        if (ev.currentTarget.classList.contains("back")) return true; //Button currently in back state
                        contextMenu(ev, this.Archived && this.Archived.$el.childElementCount)
                    }}/>
                    <div className="search">
                        <div className="input-search">
                            <LazyInput type="text" placeholder="Search"
                                       onFocus={this.openSearch}
                                       onInput={this.onSearchInputCapture}
                                       lazyLevel={300}/>
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

    componentDidMount() {
        this.Archived = VComponent.getComponentById(`dialogs-archived-list`)
        this.dialogsWrapperRef.$el.addEventListener("scroll", this._scrollHandler, {passive: true})
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
    }

    onDialogsGotMany = _ => {
        this.loaderRef.hide()
    }

    onChatSelect = _ => {
        if (AppSelectedChat.isSelected) {
            this.$el.classList.add("responsive-selected-chatlist")
        } else {
            this.$el.classList.remove("responsive-selected-chatlist")
        }
    }

    openSearch = () => {
        console.warn("open")

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

    onSearchInputCapture = event => {
        UIEvents.LeftSidebar.fire("searchInputUpdated", {
            string: event.target.value.trim()
        })
    }
}