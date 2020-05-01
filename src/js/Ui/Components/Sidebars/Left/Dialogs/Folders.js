import VComponent from "../../../../../V/VRDOM/component/VComponent";
import "./Folders.scss";
import MTProto from "../../../../../MTProto/External";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import type {AE} from "../../../../../V/VRDOM/component/__component_registerAppEvents";
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import VUI from "../../../../VUI";
import {ChatInputManager} from "../../../Columns/Chat/ChatInput/ChatInputComponent";
import {DialogsBarContextMenu} from "./DialogsBar";
import {BurgerAndBackComponent} from "../BurgerAndBackComponent";

const FolderFragment = ({folderId, icon, title, badge = {active: false, count: 0}, selected = false, onClick}) => {
    return <div className={{
        folder: true,
        selected,
        "rp": true
    }} onClick={onClick} onContextMenu={folderId && VUI.ContextMenu.listener([
        {
            icon: "edit",
            title: "Edit Folder",
            onClick: _ => {
                // TODO edit folder
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
        <i className="icon">{icon}</i>
        <span className="title">{title}</span>
        <span className={{"badge": true, "active": badge.active}}>{badge.count <= 0 ? "" : badge.count}</span>
    </div>
}

export class Folders extends VComponent {
    state = {
        folders: [],
        selectedFolder: null
    }
    appEvents(E: AE) {
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.onFoldersUpdate)
            .on("selectFolder", this.onSelectFolder)
        // TODO handle *seen* event to decrease number
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.updateCounters)
            .on("gotNewMany", this.updateCounters)
    }

    init() {
        super.init()
        FoldersManager.fetchFolders()
    }

    render() {
        return <div class={{
            "folder-list": true,
            "hidden": !FoldersManager.hasFolders()
        }}>
            <BurgerAndBackComponent isMain/>
            <FolderFragment icon="🐶" title="All chats" selected={this.state.selectedFolder == null} badge={FoldersManager.getBadgeCount(null)} onClick={_ => FoldersManager.selectFolder(null)}/>
            {this.state.folders.map(l => {
                return <FolderFragment icon={l.emoticon || "🤪"} title={l.title} selected={l.id === this.state.selectedFolder} badge={FoldersManager.getBadgeCount(l.id)} folderId={l.id} onClick={_ => FoldersManager.selectFolder(l.id)}/>
            })}

            <FolderFragment icon="⚙" title="Edit" onClick={this.editFolders}/>
        </div>
    }

    editFolders = () => {
        console.log("edit folders")
        FoldersManager.getSuggestedFolders()
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