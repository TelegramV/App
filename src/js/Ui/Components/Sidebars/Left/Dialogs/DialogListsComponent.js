import VComponent from "../../../../../V/VRDOM/component/VComponent";
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent";
import GeneralDialogListComponent from "./Lists/GeneralDialogListComponent";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import classIf from "../../../../../V/VRDOM/jsx/helpers/classIf";
import MTProto from "../../../../../MTProto/External";
import lottie from "../../../../../../../vendor/lottie-web";
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";

class DialogFolderFragment extends VComponent {

    pinned = VComponent.createComponentRef()
    general = VComponent.createComponentRef()

    get folderId() {
        return this.props.folderId
    }

    render() {
        const selected = this.props.selected
        const folderId = this.props.folderId
        const filter = this.props.filter

        return <div class={classIf(!selected, "hidden")}>
            <PinnedDialogListComponent ref={this.pinned} folderId={folderId} filter={filter}/>
            <GeneralDialogListComponent ref={this.general} folderId={folderId} filter={filter}/>
        </div>
    }

    set hidden(value) {
        this.$el.classList.toggle("hidden", value)
    }

    updateFilter(newFilter) {
        this.pinned.component.updateFilter(newFilter)
        this.general.component.updateFilter(newFilter)
    }
}

export class DialogListsComponent extends VComponent {
    folders = []
    selectedFolder = null
    folderRefs = [VComponent.createComponentRef()]

    appEvents(E: AE) {
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.onFoldersUpdate)
            .on("selectFolder", this.onSelectFolder)
    }

    render() {
        return <div className="dialog-lists">
            {/*<div className="empty"/>*/}
            {/* All chats */}
            <DialogFolderFragment ref={this.folderRefs[0]} folderId={null} filter={null} selected={this.selectedFolder == null}/>
            {/*{this.state.folders.map(l => {*/}
            {/*    return <DialogFolderFragment folderId={l.id} filter={l} selected={this.selectedFolder === l.id}/>*/}
            {/*})}*/}
        </div>
    }

    // componentDidMount() {
    //     super.componentDidMount()
    //     console.log("componentDidMount")
    //
    //     fetch("./static/animated/filter_no_chats.tgs").then(l => {
    //         console.log("componentDidMount", l)
    //
    //         return l.arrayBuffer().then( b => {
    //             return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(b)))
    //         })
    //     }).then(l => {
    //         console.log("componentDidMount", l)
    //         if (this.animation) {
    //             this.animation.destroy()
    //         }
    //         console.log(l)
    //         this.animation = lottie.loadAnimation({
    //             container: this.$el.querySelector(".empty"),
    //             renderer: 'canvas',
    //             loop: true,
    //             autoplay: true,
    //             name: "lol",
    //             animationData: l
    //         })
    //         this.animation.setSubframe(false)
    //         console.log(this.$el.querySelector(".empty"))
    //
    //         // this.animation.play()
    //         // this.animation.addEventListener("loopComplete", this._completionListener.bind(this));
    //         // this.animation.addEventListener("enterFrame", this._frameListener.bind(this));
    //     })
    // }

    addFolder = (folder) => {
        const ref = VComponent.createComponentRef()
        this.folderRefs.push(ref)
        VRDOM.append(<DialogFolderFragment ref={ref} folderId={folder.id} filter={folder} selected={this.selectedFolder === folder.id}/>, this.$el)
    }

    onFoldersUpdate = (event) => {
        this.folders = event.folders
        const found = [null]
        const destroyed = []
        this.folderRefs.forEach(l => {
            const component: DialogFolderFragment = l.component
            if(component.folderId == null) return
            const folder = this.folders.find(l => l.id === component.folderId)
            if(folder) {
                found.push(component.folderId)
                component.updateFilter(folder)
            } else {
                if(this.selectedFolder === component.folderId) {
                    FoldersManager.selectFolder(null)
                }
                component.__destroy()
                destroyed.push(l)
            }
        })

        destroyed.forEach(l => {
            this.folderRefs.splice(this.folderRefs.indexOf(l), 1)
        })

        this.folders.forEach(l => {
            if(!found.includes(l.id)) {
                this.addFolder(l)
            }
        })
        // this.setState({
        //     folders: event.folders
        // })
    }

    onSelectFolder = (event) => {
        // console.log("select folder", event.folderId)
        this.selectedFolder = event.folderId
        this.folderRefs.forEach(l => {
            const component: DialogFolderFragment = l.component
            component.hidden = component.folderId !== this.selectedFolder
        })
        // this.setState({
        //     selectedFolder: folderId
        // })
    }

}