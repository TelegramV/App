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
import ConnectionStatusComponent from "../../../Sidebars/Left/Dialogs/ConnectionStatusComponent";
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import VButton from "../../../../Elements/Button/VButton";
import SimpleVirtualList from "../../../../../V/VRDOM/list/SimpleVirtualList";
import DynamicHeightVirtualList from "../../../../../V/VRDOM/list/DynamicHeightVirtualList";
import {Dialog} from "../../../../../Api/Dialogs/Dialog";
import {DialogComponent} from "./Fragments/DialogComponent";

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

export class DialogsSidebar extends LeftSidebar {
    state = {
        hidden: false,
        // pinned: new VArray(),
        // [{
        //   folderId: number,
        //   pinned: new VArray,
        //   dialogs: new VArray()
        // }]
        dialogs: [],
        folders: []
    }

    appEvents(E: AE) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onGotMany)
            .on("gotNewMany", this.onGotMany)
            .on("newMessage", this.onNewMessage)
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.onFoldersUpdate)
    }

    init() {
        FoldersManager.fetchFolders()
    }

    onNewMessage = (event) => {
        console.time("onNewMessage")
        this.forceUpdate()
        console.timeEnd("onNewMessage")
    }

    content(): * {
        const dialogHeight = 72 + 4
        return <this.contentWrapper>
            <ConnectionStatusComponent/>


            <TabSelector tabs={[{
                name: "All",
                content: <DynamicHeightVirtualList items={this.state.dialogs.sort(this.compareDialogs)}
                                                   itemHeight={dialogHeight}
                                                   template={DialogComponent} onScroll={this.onSectionScroll}/>
            }, ...this.state.folders.map(folder => {
                return {
                    name: folder.title,
                    // onScroll: this.onSectionScroll,
                    content: <DynamicHeightVirtualList items={this.state.dialogs.filter(dialog => dialog.matchesFilter(folder)).sort(this.compareDialogs)}
                                                       itemHeight={dialogHeight}
                                                       template={DialogComponent} onScroll={this.onSectionScroll}
                    />
                    //<List template={DialogFragment} list={this.state.dialogs} wrapper={<Section/>}/>
                }
            })]}/>

            {/*<Section>*/}
            {/*    /!*<List template={DialogComponent} list={this.state.pinned}/>*!/*/}
            {/*</Section>*/}

            {/*<List template={DialogFragment} list={this.state.dialogs} wrapper={<Section/>}/>*/}
        </this.contentWrapper>
    }

    compareDialogs = (a: Dialog, b: Dialog) => {
        return b.messages.last.date - a.messages.last.date
    }

    onSectionScroll = (event) => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop && !this.isLoadingMore) {
            this.loadNextPage()
        }
    }

    loadNextPage() {
        if(this.isLoadingMore) return
        this.isLoadingMore = true

        DialogsManager.fetchNextPage({}).then(() => {
            this.isLoadingMore = false
        })
    }

    clone = () => {
        const f = this.state.dialogs
        f.addMany(f.items)
        this.setState({
            dialogs: f
        })
    }

    onFoldersUpdate = (event) => {
        console.log("onFoldersUpdate", event.folders)
        this.setState({
            folders: event.folders
        })
    }

    onGotMany = (event) => {
        this.state.dialogs.push(...event.dialogs)
        console.time("lol")
        this.forceUpdate()
        console.timeEnd("lol")
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

    openSearch = () => {

    }

    onSearchInputCapture = () => {

    }
}