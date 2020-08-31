import "./Folders.scss";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import type { AE } from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import VUI from "../../../../VUI";
import TranslatableStatefulComponent from "../../../../../V/VRDOM/component/TranslatableStatefulComponent"
import UIEvents from "../../../../EventBus/UIEvents";
import { CreateFolderSidebar } from "../Settings/Folders/CreateFolderSidebar";
import foldersState from "../../../foldersState"
import TabSelectorComponent from "../../../Tab/TabSelectorComponent"
import Locale from "../../../../../Api/Localization/Locale"

const FolderFragment = ({ folderId, icon, title, badge = { active: false, count: 0 } }) => {
    return <div className={{
                            folder: true,
                            item: true,
                        }}>
        <span className="title">
            {title}
            <span className={{"badge": true, "active": badge.active}}>{badge.count <= 0 ? "" : (badge.count > 99 ? "99+" : badge.count)}</span>
        </span>
    </div>
}

export class Folders extends TranslatableStatefulComponent {
    state = foldersState;

    appEvents(E: AE) {
        // E.bus(AppEvents.General)
        //     .on("foldersUpdate", this.onFoldersUpdate)
        //     .on("selectFolder", this.onSelectFolder)
        // TODO handle *seen* event to decrease number
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.updateCounters)
            .on("gotNewMany", this.updateCounters)

        E.bus(AppEvents.Peers)
            .on("messages.deleted", this.updateCounters)
            .on("messages.readOut", this.updateCounters)
            .on("messages.readIn", this.updateCounters)
    }

    render(props) {
        return <div class={{
            "folder-list": true,
            "hidden": !FoldersManager.hasFolders(),
        }}>

        <TabSelectorComponent items={this.tabs} active={this.findSelected()} scrollable/>
        </div>
    }

    componentWillMount() {
        this.tabs = this.makeTabs(this.state.folders);
    }

    componentWillUpdate(nextProps, nextState) {
        this.tabs = this.makeTabs(nextState.folders);
    }

    makeTabs = (folders) => {
        const tabs = [{
            text: <FolderFragment title={this.l("lng_filters_all", {}, "All chats")} badge={FoldersManager.getBadgeCount(null)}/>,
            onClick: () => FoldersManager.selectFolder(null),
            key: "all"
        }]

        folders.forEach(folder => {
            tabs.push({
                text: <FolderFragment title={folder.title}
                                       badge={FoldersManager.getBadgeCount(folder.id)}
                                       folderId={folder.id}/>,
                onClick: () => FoldersManager.selectFolder(folder.id),
                key: folder.id,
                onContextMenu: folder.id && VUI.ContextMenu.listener([{
                        icon: "edit",
                        title: Locale.l("lng_filters_context_edit"),
                        onClick: _ => {
                            UIEvents.Sidebars.fire("push", {
                                sidebar: CreateFolderSidebar,
                                folderId: folder.id
                            })
                        }
                    },
                    {
                        icon: "delete",
                        title: Locale.l("lng_filters_context_remove"),
                        red: true,
                        onClick: _ => {
                            FoldersManager.deleteFolder(folder.id)
                        }
                    },
                ])
            })
        })
        return tabs;
    }

    findSelected = () => {
        if (!this.tabs) return 1;
        let selected = this.tabs.findIndex(el => el.key === (this.state.currentId)) + 1;
        return selected || 1;
    }

    editFolders = () => {

        // UIEvents.LeftSidebar.fire("show", {
        //     barName: "settings"
        // })
        // UIEvents.LeftSidebar.fire("show", {
        //     barName: "folder-settings"
        // })
        // FoldersManager.getSuggestedFolders()
    }

    onFoldersUpdate = (event) => {
        this.state.folders = []
        this.setState({
            folders: event.folders
        })
    }

    onSelectFolder = (event) => {
        this.setState({
            currentId: event.folderId
        })
    }

    updateCounters = (event) => {
        this.forceUpdate()
    }
}