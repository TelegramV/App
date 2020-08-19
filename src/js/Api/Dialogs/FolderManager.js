import MTProto from "../../MTProto/External";
import AppEvents from "../EventBus/AppEvents";
import UpdatesManager from "../Updates/UpdatesManager";
import DialogsStore from "../Store/DialogsStore";
import {Peer} from "../Peers/Objects/Peer";
import {isEquivalent} from "../../Utils/array";
import keval from "../../Keval/keval";
import foldersState from "../../Ui/Components/foldersState";

class FolderManager {
    folders = []
    selectedFolder = null
    MAX_FOLDERS = 10
    suggestedFolders: [] = null

    constructor() {
        // макс чого воно при логіні показується????????????????????????????
        /*keval.getItem("foldersData").then(foldersData => {
            if (!foldersData) return
            this.folders = foldersData.folders
            this.selectedFolder = foldersData.selected

            this.fireUpdate()
            AppEvents.General.fire("selectFolder", {
                folder: this.getFolder(this.selectedFolder),
                folderId: this.selectedFolder
            })
        })*/
    }

    init() {
        keval.getItem("foldersData").then(foldersData => {
            if (!foldersData) return
            this.folders = foldersData.folders
            this.selectedFolder = foldersData.selected

            this.fireUpdate()
            AppEvents.General.fire("selectFolder", {
                folder: this.getFolder(this.selectedFolder),
                folderId: this.selectedFolder
            })
        })

        foldersState.init()

        // should be separated in different files and moved to Api/Updates/Update
        UpdatesManager.subscribe("updateDialogFilter", this.updateDialogFilter)
        UpdatesManager.subscribe("updateDialogFilterOrder", this.updateDialogFilterOrder)
        UpdatesManager.subscribe("updateDialogFilters", this.updateDialogFilters)
    }

    updateDialogFilter = (event) => {
        const filter = event.filter
        const index = this.folders.findIndex(l => l.id === event.id)
        if (!filter) {
            this.folders.splice(index, 1)
        } else if (index === -1) {
            this.folders.push(filter)
        } else {
            this.folders[index] = filter
        }
        this.updateCache()
        this.fireUpdate()
    }

    updateDialogFilterOrder = (event) => {
        const order = event.order
        const newFolders = order.map(() => null)
        for (let i = 0; i < order.length; i++) {
            newFolders[i] = this.folders.find(l => l.id === order[i])
        }
        this.folders = newFolders
        this.updateCache()
        this.fireUpdate()
    }

    updateDialogFilters = (event) => {
        // Unknown
        //console.log("updateDialogFilters", event)
    }

    async fetchFolders() {
        this.folders = await MTProto.invokeMethod("messages.getDialogFilters")
        this.updateCache()
        this.fireUpdate()
    }

    async fetchSuggestedFolders() {
        this.suggestedFolders = await MTProto.invokeMethod("messages.getSuggestedDialogFilters")
        AppEvents.General.fire("suggestedFoldersUpdate", {
            suggestedFolders: this.suggestedFolders
        })
    }

    updateCache() {
        keval.setItem("foldersData", {
            folders: this.folders,
            selected: this.selectedFolder
        })
    }

    getFolder(folderId: number) {
        return this.folders.find(l => l.id === folderId)
    }

    isPinned(peer: Peer, folderId: number) {
        const filter = this.getFolder(folderId)
        if (filter == null) return false
        return filter.pinned_peers.find(l => isEquivalent(l, peer.inputPeer))
    }

    async setPinned(pinned: boolean, peer: Peer, folderId: number) {
        // updateDialogFilter#26ffde7d flags:# id:int filter:flags.0?DialogFilter = Update;
        // messages.updateDialogFilter#1ad4a04a flags:# id:int filter:flags.0?DialogFilter = Bool;
        const filter = this.getFolder(folderId)
        if (pinned) {
            if (!filter.pinned_peers.find(l => isEquivalent(l, peer.inputPeer))) {
                filter.pinned_peers.push(peer.inputPeer)
            }
        } else {
            const a = filter.pinned_peers.find(l => isEquivalent(l, peer.inputPeer))
            if (a) {
                filter.pinned_peers.splice(filter.pinned_peers.indexOf(a), 1)
                if (!peer.dialog.matchesFilter(filter)) {
                    filter.include_peers.push(peer.inputPeer)
                }
            }
        }
        const response = await MTProto.invokeMethod("messages.updateDialogFilter", {
            id: folderId,
            filter: filter
        })

        if (response._ === "boolTrue") {
            peer.dialog.fire("updatePinned")
        }

    }

    async updateFolder(filter) {
        //console.log("updateFolder", filter)
        const response = await MTProto.invokeMethod("messages.updateDialogFilter", {
            id: filter.id,
            filter: filter
        })
        //console.log(response)
        const index = this.folders.findIndex(l => l.id === filter.id)
        if (index === -1) {
            this.folders.push(filter)
        } else {
            this.folders[this.folders.findIndex(l => l.id === filter.id)] = filter
        }
        this.fireUpdate()
        this.updateCache()

    }

    async createFolder(filter) {
        filter.id = this.folders.reduce((l, q) => {
            return l.id > q.id
        }).id + 1
        //console.log("creating folder", filter, this.folders)
        const response = await MTProto.invokeMethod("messages.updateDialogFilter", {
            id: filter.id,
            filter: filter
        })
    }

    fireUpdate() {
        AppEvents.General.fire("foldersUpdate", {
            folders: this.folders
        })
    }

    async deleteFolder(folderId) {
        this.folders = this.folders.filter(l => l.id !== folderId)
        const response = await MTProto.invokeMethod("messages.updateDialogFilter", {
            id: folderId
        })
        this.updateCache()
        this.fireUpdate()
    }

    getSuggestedFolders() {
        if (this.suggestedFolders == null) {
            this.fetchSuggestedFolders()
            return []
        }
        return this.suggestedFolders
    }

    getBadgeCount(folderId) {
        if (folderId === null) {
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
        this.updateCache()
    }


}

const FoldersManager = new FolderManager()

export default FoldersManager