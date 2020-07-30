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
import {SearchComponent} from "../Search/SearchComponent";
import {isMobile} from "../../../../Utils/utils";
import Locale from "../../../../../Api/Localization/Locale"

export const DialogsBarContextMenu = (event, archivedCount) => {
    VUI.ContextMenu.openBelow([
        {
            icon: "newgroup",
            title: Locale.l("lng_create_group_title"),
            onClick: _ => {
            }
        },
        {
            icon: "newprivate",
            title: Locale.l("lng_menu_contacts"),
        },
        () => {
            return {
                icon: "archive",
                title: Locale.l("lng_archived_name"),
                counter: archivedCount,
                onClick: _ => {
                    UIEvents.Sidebars.fire("push", ArchivedSidebar)

                }
            }
        },
        {
            icon: "savedmessages",
            title: Locale.l("lng_saved_messages"),
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
            title: Locale.l("lng_menu_settings"),
            onClick: _ => {
                UIEvents.Sidebars.fire("push", SettingsSidebar)
            }
        },
        {
            icon: "help",
            title: Locale.l("lng_linux_menu_help"), //idk why only on linux
        }
    ], event.target)
}

export class DialogsSidebar extends UnpatchableLeftSidebar {
    isLoadingMore = false

    loaderRef = VComponent.createRef()
    searchRef = VComponent.createComponentRef()
    dialogsWrapperRef = VComponent.createRef()

    searchOpen = false

    searchPlaceholder = "Telegram Search"

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

            <SearchComponent ref={this.searchRef}/>
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

        E.bus(UIEvents.General)
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
        if(isMobile()) {
            if (AppSelectedChat.isSelected) {
                this.fadeOut()
                // this.$el.classList.add("fade-out")
            } else {
                // UIEvents.Sidebars.fire("push", DialogsSidebar)

                this.show()
                // this.$el.classList.remove("responsive-selected-chatlist")
            }
        }
    }

    onBackPressed = (event) => {
        if (event.id === "search") {
            this._searchBackClick()
        }
    }

    onSearchInputFocus = (event) => {
        this.$el.classList.toggle("back-button", true)
        this.searchOpen = true
        this.searchRef.component.open()
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
            // TODO should also check if filter is fulfilled

            if (this.$el.querySelector(".dialog-lists .folder-fragment:not(.hidden)").clientHeight < this.$el.clientHeight) {
                this.loadNextPage()
            }
        })
    }

    onSearchInputUpdated = event => {
        UIEvents.Sidebars.fire("searchInputUpdated", {
            string: event.target.value.trim()
        })
    }

    onLeftButtonPressed = (event) => {
        if(this.searchOpen) {
            this.$el.classList.toggle("back-button", false)
            this.searchOpen = false
            this.searchRef.component.close()
        } else {
            DialogsBarContextMenu(event, DialogsManager.archivedMessagesCount)
        }
    }

    get leftButtonIcon(): string | null {
        return "menu"
    }

    get isStatic(): boolean {
        return true
    }

    get searchLazyLevel(): number {
        return 200
    }

    get isSearchAsTitle(): boolean {
        return true
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