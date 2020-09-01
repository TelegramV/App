import "./DialogsSidebar.scss";
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager";
import VUI from "../../../../VUI";
import UIEvents from "../../../../EventBus/UIEvents";
import PeersStore from "../../../../../Api/Store/PeersStore";
import VApp from "../../../../../V/vapp";
import {SettingsSidebar} from "../Settings/SettingsSidebar";
import {ArchivedSidebar} from "./ArchivedSidebar";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import AppSelectedChat from "../../../../Reactive/SelectedChat";
import {IS_MOBILE_SCREEN} from "../../../../../Utils/browser";
import Locale from "../../../../../Api/Localization/Locale"
import VirtualDialogsFolderList from "./VirtualDialogsFolderList"
import {Folders} from "./Folders"
import {SearchComponent} from "../Search/SearchComponent"
import ConnectionStatusComponent from "./ConnectionStatusComponent"
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import {LeftSidebar} from "../LeftSidebar";
import {CreateChannelSidebar} from "../NewChats/CreateChannelSidebar"

export const DialogsBarContextMenu = (event, archivedCount) => {
    VUI.ContextMenu.openBelow([
        {
            icon: "newgroup",
            title: Locale.l("lng_create_group_title", {}, "New Group"),
            onClick: _ => {
            }
        },
        {
            icon: "newprivate",
            title: Locale.l("lng_menu_contacts", {}, "Contacts"),
        },
        () => {
            return {
                icon: "archive",
                title: Locale.l("lng_archived_name", {}, "Archived chats"),
                counter: archivedCount,
                onClick: _ => {
                    UIEvents.Sidebars.fire("push", ArchivedSidebar)

                }
            }
        },
        {
            icon: "savedmessages",
            title: Locale.l("lng_saved_messages", {}, "Saved Messages"),
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
            title: Locale.l("lng_menu_settings", {} , "Settings"),
            onClick: _ => {
                UIEvents.Sidebars.fire("push", SettingsSidebar)
            }
        },
        {
            icon: "help",
            title: Locale.l("lng_linux_menu_help", {}, "Help"), //idk why only on linux
        }
    ], event.target)
}

export class DialogsSidebar extends LeftSidebar {
    state = {
        loading: true
    }

    isLoadingMore = false

    // loaderRef = VComponent.createRef()
    searchRef = VComponent.createComponentRef()
    dialogsWrapperRef = VComponent.createRef()

    searchOpen = false
    fixedFab = false

    init() {
        // FoldersManager.fetchFolders()
    }

    onFloatingActionButtonPressed = (event) => {
        this.fixedFab = true;
        VUI.ContextMenu.openAbove([
            {
                icon: "channel",
                title: this.l("lng_create_channel_title", {} , "New Channel"),
                onClick: () => {
                    UIEvents.Sidebars.fire("push", CreateChannelSidebar)
                }
            },
            {
                icon: "group",
                title: this.l("lng_create_group_title", {}, "New Group"),
            },
            {
                icon: "user",
                title: "New Private Chat"
            }
        ], event.target)
        this.forceUpdate();
    }

    content(): * {
        return <this.contentWrapper scrollable={false}>
            <ConnectionStatusComponent/>

            <Folders/>
            {
                this.state.loading ?
                    <div ref={this.loaderRef} className="full-size-loader" id="loader" style={{
                        "height": "100%",
                        "width": "100%",
                        "display": "flex",
                        "align-items": "center",
                        "justify-content": "center",
                    }}>
                        <progress className="progress-circular big"/>
                    </div> : ""
            }
            <VirtualDialogsFolderList/>


            {/*<div ref={this.dialogsWrapperRef} id="dialogsWrapper" class={{"scrollable": true, "loading": true}}>*/}
            {/*    <div ref={this.loaderRef} className="full-size-loader" id="loader">*/}
            {/*        <progress className="progress-circular big"/>*/}
            {/*    </div>*/}

            {/*    <DialogListsComponent/>*/}
            {/*</div>*/}

            <SearchComponent ref={this.searchRef}/>
        </this.contentWrapper>
    }

    componentDidMount() {
        // this.Archived = VComponent.getComponentById(`dialogs-archived-list`)
        // this.dialogsWrapperRef.$el.addEventListener("scroll", this._scrollHandler, {passive: true})
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.Dialogs)
             .on("gotMany", this.onDialogsGotMany)

        E.bus(UIEvents.General)
            .on("context.close", (ev) => {
                this.fixedFab = false;
                this.forceUpdate();
            })

        // E.bus(AppEvents.General)
        //     .on("selectFolder", this.onFolderSelect)
        //
        // E.bus(UIEvents.General)
        //     .on("chat.select", this.onChatSelect)


    }

    onDialogsGotMany = _ => {
        this.setState({
            loading: false
        })
        // console.log("got many", this.loaderRef.$el, this.loaderRef.$el.parentNode)
        // if (this.loaderRef.$el && this.loaderRef.$el.parentNode) this.loaderRef.$el.parentNode.removeChild(this.loaderRef.$el)
        // this.dialogsWrapperRef.$el.classList.remove("loading")
    }

    // onFolderSelect = _ => {
    //     this.dialogsWrapperRef.$el.scrollTop = 0
    //     if (this.$el.querySelector(".dialog-lists").clientHeight < this.$el.clientHeight) {
    //         this.loadNextPage()
    //     }
    // }

    onChatSelect = _ => {
        if (IS_MOBILE_SCREEN) {
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

    // _scrollHandler = (event) => {
    //     const $element = event.target
    //
    //     if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop && !this.isLoadingMore) {
    //         this.loadNextPage()
    //     }
    // }

    // loadNextPage() {
    //     if (this.isLoadingMore) return
    //     this.isLoadingMore = true
    //
    //     DialogsManager.fetchNextPage({}).then(() => {
    //         this.isLoadingMore = false
    //         // TODO should also check if filter is fulfilled
    //
    //         if (this.$el.querySelector(".dialog-lists .folder-fragment:not(.hidden)").clientHeight < this.$el.clientHeight) {
    //             this.loadNextPage()
    //         }
    //     })
    // }

    onSearchInputUpdated = event => {
        UIEvents.Sidebars.fire("searchInputUpdated", {
            string: event.target.value.trim()
        })
    }

    onLeftButtonPressed = (event) => {
        if (this.searchOpen) {
            this.setState({
                inputValue: ""
            })
            UIEvents.Sidebars.fire("searchInputUpdated", {
                string: ""
            })
            this.forceUpdate()
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
        return this.fixedFab ? "close" : "newchat_filled"
    }

    get isFloatingActionButtonOnHover(): boolean {
        return true
    }

    get isFloatingActionButtonFixed() {
        return this.fixedFab
    }

    get headerBorder(): boolean {
        return false
    }

    /*get searchPlaceholder() {
        return "Telegram Search"
    }*/
}