import "./DialogsSidebar.scss";
import {LeftSidebar} from "../LeftSidebar";
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput";
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager";
import VUI from "../../../../VUI";
import UIEvents from "../../../../EventBus/UIEvents";
import PeersStore from "../../../../../Api/Store/PeersStore";
import VApp from "../../../../../V/vapp";
import {SettingsSidebar} from "../Settings/SettingsSidebar";
import {ArchivedSidebar} from "./ArchivedSidebar";
import {Section} from "../../Fragments/Section";
import VArray from "../../../../../V/VRDOM/list/VArray";
import List from "../../../../../V/VRDOM/list/List";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import TabSelectorComponent from "../../../Tab/TabSelectorComponent";
import {TabSelector} from "../../Fragments/TabSelector";
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import VButton from "../../../../Elements/Button/VButton";
import SimpleVirtualList from "../../../../../V/VRDOM/list/SimpleVirtualList";
import DynamicHeightVirtualList from "../../../../../V/VRDOM/list/DynamicHeightVirtualList";
import {Dialog} from "../../../../../Api/Dialogs/Dialog";
import {UnpatchableLeftSidebar} from "../UnpatchableLeftSidebar";
import ConnectionStatusComponent from "./ConnectionStatusComponent";
import {DialogListsComponent} from "./DialogListsComponent";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import AppSelectedChat from "../../../../Reactive/SelectedChat";
import {Folders} from "./Folders";

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
                    UIEvents.Sidebars.fire("push", ArchivedSidebar)

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
                UIEvents.Sidebars.fire("push", SettingsSidebar)
            }
        },
        {
            icon: "help",
            title: "Help"
        }
    ], event.target)
}

export class DialogsSidebar extends UnpatchableLeftSidebar {
    isLoadingMore = false

    loaderRef = VComponent.createRef()
    dialogsWrapperRef = VComponent.createRef()


    init() {
        FoldersManager.fetchFolders()
    }

    onFloatingActionButtonPressed = (event) => {
        VUI.ContextMenu.openAbove([
            {
                icon: "channel",
                title: "New Channel",
                onClick: () => {
                    // UIEvents.LeftSidebar.fire("show", {barName: "create-channel"})
                }
            },
            {
                icon: "group",
                title: "New Group"
            },
            {
                icon: "user",
                title: "New Private Chat"
            }
        ], event.target)
    }

    content(): * {
        return <this.contentWrapper>
            <ConnectionStatusComponent/>
            <Folders/>

            <div ref={this.dialogsWrapperRef} id="dialogsWrapper" class={{"scrollable": true, "loading": true}}>
                <div ref={this.loaderRef} className="full-size-loader" id="loader">
                    <progress className="progress-circular big"/>
                </div>

                <DialogListsComponent/>
            </div>
        </this.contentWrapper>
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


    }

    onDialogsGotMany = _ => {
        if(this.loaderRef.$el.parentElement) this.loaderRef.$el.parentElement.removeChild(this.loaderRef.$el)
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

    onLeftButtonPressed = (event) => {
        DialogsBarContextMenu(event, DialogsManager.archivedMessagesCount)
    }

    get leftButtonIcon(): string | null {
        return "menu"
    }

    get isStatic(): boolean {
        return true
    }

    get title(): string | * {
        return  <div className="input-search">
            <VSimpleLazyInput type="text" placeholder="Search"
                              onFocus={this.openSearch}
                              onInput={this.onSearchInputCapture}
                              lazyLevel={200}/>
            <span className="tgico tgico-search"/>
        </div>
    }

    get classes() {
        const c = super.classes
        c.push("dialogs")
        return c
    }

    get floatingActionButtonIcon(): string | null {
        return "newchat_filled"
    }

    get isFloatingActionButtonOnHover(): boolean {
        return true
    }

    get headerBorder(): boolean {
        return false
    }
}