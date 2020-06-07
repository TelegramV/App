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
import {DialogComponent} from "../../../Sidebars/Left/Dialogs/DialogComponent";
import VArray from "../../../../../V/VRDOM/list/VArray";
import List from "../../../../../V/VRDOM/list/List";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import {DialogFragment} from "./Fragments/DialogFragment";
import TabSelectorComponent from "../../../Tab/TabSelectorComponent";
import {TabSelector} from "../../Fragments/TabSelector";
import ConnectionStatusComponent from "../../../Sidebars/Left/Dialogs/ConnectionStatusComponent";
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import VButton from "../../../../Elements/Button/VButton";
import SimpleVirtualList from "../../../../../V/VRDOM/list/SimpleVirtualList";

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
        pinned: new VArray(),
        dialogs: new VArray(),
        folders: []
    }

    appEvents(E: AE) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onGotMany)
            .on("gotNewMany", this.onGotMany)
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.onFoldersUpdate)
    }

    init() {
        FoldersManager.fetchFolders()
    }

    content(): * {
        return <this.contentWrapper>
            <ConnectionStatusComponent/>
            <VButton onClick={_ => this.loadNextPage()}/>


            <TabSelector tabs={this.state.folders.map(folder => {
                return {
                    name: folder.title,
                    // onScroll: this.onSectionScroll,
                    content: <SimpleVirtualList items={this.state.dialogs.items}
                                                 containerHeight={900}
                                                 itemHeight={72}
                                                 template={DialogFragment}
                    />
                    //<List template={DialogFragment} list={this.state.dialogs} wrapper={<Section/>}/>
                }
            })}/>
            {/*<Section>*/}
            {/*    /!*<List template={DialogComponent} list={this.state.pinned}/>*!/*/}
            {/*</Section>*/}

            {/*<List template={DialogFragment} list={this.state.dialogs} wrapper={<Section/>}/>*/}
        </this.contentWrapper>
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
        // console.log("STARTED LOADING NEW PAGE")

        DialogsManager.fetchNextPage({}).then(() => {
            this.isLoadingMore = false
            // console.log("STOPPED LOADING NEW PAGE")
            // if(this.$el.querySelector(".dialog-lists").clientHeight < this.$el.clientHeight) {
            //     this.loadNextPage()
            // }
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
        console.log("got many", event.dialogs)
        this.state.dialogs.addMany(event.dialogs)
        this.forceUpdate()
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