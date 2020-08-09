import "./Folders.scss";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import VUI from "../../../../VUI";
import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import UIEvents from "../../../../EventBus/UIEvents";
import {CreateFolderSidebar} from "../Settings/Folders/CreateFolderSidebar";
import foldersState from "../../../foldersState"

const FolderFragment = ({folderId, icon, title, badge = {active: false, count: 0}, selected = false, onClick}) => {
    return <div className={{
        folder: true,
        item: true,
        rp: true,
        rps: true,
        selected,
    }} onClick={onClick} onContextMenu={folderId && VUI.ContextMenu.listener([
        {
            icon: "edit",
            title: "Edit Folder",
            onClick: _ => {
                UIEvents.Sidebars.fire("push", {
                    sidebar: CreateFolderSidebar,
                    folderId: folderId
                })
            }
        },
        {
            icon: "delete",
            title: "Remove",
            red: true,
            onClick: _ => {
                FoldersManager.deleteFolder(folderId)
            }
        },
    ])}>
        <span className="title">
            {title}
            <span className={{"badge": true, "active": badge.active}}>{badge.count <= 0 ? "" : badge.count}</span>
        </span>
    </div>
}

export class Folders extends StatefulComponent {
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

    render(props, {folders, current}) {
        return <div class={{
            "folder-list": true,
            "tab-selector": true,
            "hidden": !FoldersManager.hasFolders(),
            "scrollable-x": true,
            "hide-scroll": true
        }}>
            <FolderFragment title="All"
                            selected={current == null}
                            badge={FoldersManager.getBadgeCount(null)}
                            onClick={() => FoldersManager.selectFolder(null)}/>

            {folders.map(folder => {
                return <FolderFragment title={folder.title}
                                       selected={folder === current}
                                       badge={FoldersManager.getBadgeCount(folder.id)}
                                       folderId={folder.id}
                                       onClick={() => FoldersManager.selectFolder(folder.id)}/>
            })}
        </div>
    }

    //
    // componentDidMount() {
    //     super.componentDidMount();
    //
    //     this.$el.addEventListener('wheel', this.transformScroll);
    // }

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
            selectedFolder: event.folderId
        })
    }

    updateCounters = (event) => {
        this.forceUpdate()
    }
}