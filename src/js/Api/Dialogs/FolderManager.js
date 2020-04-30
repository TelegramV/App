import MTProto from "../../MTProto/External";
import AppEvents from "../EventBus/AppEvents";
import UpdatesManager from "../Updates/UpdatesManager";
import DialogsManager from "./DialogsManager";
import DialogsStore from "../Store/DialogsStore";

class FolderManager {
    folders = []
    selectedFolder = null
    MAX_FOLDERS = 10

    constructor() {
        this.init()
    }

    init() {
        UpdatesManager.subscribe("updateDialogFilter", this.updateDialogFilter)
        UpdatesManager.subscribe("updateDialogFilterOrder", this.updateDialogFilterOrder)
        UpdatesManager.subscribe("updateDialogFilters", this.updateDialogFilters)
    }

    updateDialogFilter = (event) => {
        const filter = event.filter
        const index = this.folders.findIndex(l => l.id === event.id)
        if(!filter) {
            this.folders.splice(index, 1)
        } else if(index === -1) {
            this.folders.push(filter)
        } else {
            this.folders[index] = filter
        }
        this.fireUpdate()
    }

    updateDialogFilterOrder = (event) => {
        const order = event.order
        const newFolders = order.map(() => null)
        for(let i = 0; i < order.length; i++) {
            newFolders[i] = this.folders.find(l => l.id === order[i])
        }
        this.folders = newFolders
        this.fireUpdate()
    }

    updateDialogFilters = (event) => {
        // Unknown
        console.log("updateDialogFilters", event)
    }

    async fetchFolders() {
        this.folders = await MTProto.invokeMethod("messages.getDialogFilters")
        console.log(this.folders)
        this.fireUpdate()
    }

    fireUpdate() {
        AppEvents.General.fire("foldersUpdate", {
            folders: this.folders
        })
    }

    async deleteFolder(folderId) {

    }

    async getSuggestedFolders() {
        const suggested = await MTProto.invokeMethod("messages.getSuggestedDialogFilters")
        console.log(suggested)
    }

    getBadgeCount(folderId) {
        if(folderId === null) {
            const found = DialogsStore.toArray().filter(l => !l.isArchived && (l.peer.messages.unreadCount > 0 || l.peer.messages.unreadMentionsCount > 0))
            return {
                count: found.length,
                active: found.some(l => !l.isMuted)
            }
        } else {
            const filter = this.folders.find(l => l.id === folderId)
            const found = DialogsStore.toArray().filter(l => l.matchesFilter(filter) && (l.peer.messages.unreadCount > 0 || l.peer.messages.unreadMentionsCount > 0))
            return {
                count: found.length,
                active: found.some(l => !l.isMuted)
            }

        }
    }

    hasFolders() {
        return this.folders.length > 0
    }

    selectFolder(folderId) {
        this.selectedFolder = folderId
        const folder = this.folders.find(l => l.id === folderId)
        AppEvents.General.fire("selectFolder", {
            folder: folder,
            folderId: folderId
        })
    }


}

const FoldersManager = new FolderManager()

export default FoldersManager