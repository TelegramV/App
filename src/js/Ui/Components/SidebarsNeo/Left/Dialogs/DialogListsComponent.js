import VComponent from "../../../../../V/VRDOM/component/VComponent";
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent";
import GeneralDialogListComponent from "./Lists/GeneralDialogListComponent";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import classIf from "../../../../../V/VRDOM/jsx/helpers/classIf";
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import __component_destroy from "../../../../../V/VRDOM/component/__component_destroy";
import Lottie from "../../../../Lottie/Lottie";
import filterFilling from "../../../../../../../public/static/animated/filter_new.json";
import filterNoChats from "../../../../../../../public/static/animated/filter_no_chats.json";
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager";
import Animated from "../../Fragments/Animated";

class DialogFolderFragment extends StatelessComponent {

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

export class DialogListsComponent extends StatelessComponent {
    folders = []
    selectedFolder = null
    folderRefs = [VComponent.createComponentRef()]
    noChatsLottie = VComponent.createFragmentRef()
    loadingLottie = VComponent.createFragmentRef()

    appEvents(E: AE) {
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.onFoldersUpdate)
            .on("selectFolder", this.onSelectFolder)
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onGotMany)
            .on("gotArchived", this.onGotMany)
            .on("gotNewMany", this.onGotMany)
            .on("gotOne", this.onGotMany)
            .on("allWasFetched", this.onAllWasFetched)
    }

    render() {
        return <div className="dialog-lists">
            <div className="folder-screen loading">
                <Animated width={100} height={100} hidden={this.$el == null ? true : this.$el.classList.contains("loading")} ref={this.loadingLottie} animationData={filterFilling} loop autoplay/>
                {/*<Lottie*/}
                {/*    ref={this.loadingLottie}*/}
                {/*    width={100}*/}
                {/*    height={100}*/}
                {/*    options={{*/}
                {/*        animationData: filterFilling,*/}
                {/*        loop: true,*/}
                {/*        autoplay: true,*/}
                {/*    }}*/}
                {/*    // onClick={onClick}*/}
                {/*    />*/}
                <div className="title">Adding chats</div>
                <div className="description">Please wait a few moments while we fill this folder for you...</div>
            </div>

            <div className="folder-screen no-chats">
                <Animated width={100} height={100} hidden={this.$el == null ? true : this.$el.classList.contains("loading")} ref={this.noChatsLottie} animationData={filterNoChats} playOnHover autoplay/>

                {/*<Lottie*/}
                {/*    ref={this.noChatsLottie}*/}
                {/*    width={100}*/}
                {/*    height={100}*/}
                {/*    options={{*/}
                {/*        animationData: filterNoChats,*/}
                {/*        loop: false,*/}
                {/*        autoplay: true,*/}
                {/*    }}*/}
                {/*    // onClick={onClick}*/}
                {/*    playOnHover/>*/}
                <div className="title">No chats found</div>
                <div className="description">No chats currently belong to this folder.</div>
            </div>
            <DialogFolderFragment ref={this.folderRefs[0]} folderId={null} filter={null}
                                  selected={this.selectedFolder == null}/>
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
        VRDOM.append(<DialogFolderFragment ref={ref} folderId={folder.id} filter={folder}
                                           selected={this.selectedFolder === folder.id}/>, this.$el)
    }

    onFoldersUpdate = (event) => {
        this.folders = event.folders
        const found = [null]
        const destroyed = []
        this.folderRefs.forEach(l => {
            const component: DialogFolderFragment = l.component
            if (component.folderId == null) return
            const folder = this.folders.find(l => l.id === component.folderId)
            if (folder) {
                found.push(component.folderId)
                component.updateFilter(folder)
            } else {
                if (this.selectedFolder === component.folderId) {
                    FoldersManager.selectFolder(null)
                }

                __component_destroy(component)
                destroyed.push(l)
            }
        })

        destroyed.forEach(l => {
            this.folderRefs.splice(this.folderRefs.indexOf(l), 1)
        })

        this.folders.forEach(l => {
            if (!found.includes(l.id)) {
                this.addFolder(l)
            }
        })
        // this.setState({
        //     folders: event.folders
        // })
    }

    onAllWasFetched = _ => {
        this.onGotMany(_)
    }

    onGotMany = _ => {
        const component: DialogFolderFragment = this.folderRefs.find(l => {
            const component: DialogFolderFragment = l.component
            return component.folderId === this.selectedFolder
        }).component
        const a = FoldersManager.getFolder(this.selectedFolder)?.include_peers?.length || FoldersManager.getFolder(this.selectedFolder)?.pinned_peers?.length || 5
        const total = component.general.component.$el.childNodes.length + component.pinned.component.$el.childNodes.length
        if(total >= a) {
            this.setLoading(false)
        } else {
            if(DialogsManager.allWasFetched) {
                if(total > 0) {
                    this.setLoading(false)
                } else {
                    this.setNoChats()
                }
            } else {
                this.setLoading()
            }
        }
    }

    isLoading = () => {
        return this.$el.classList.contains("loading")
    }

    isNoChats = () => {
        return this.$el.classList.contains("no-chats")
    }

    setLoading = (value = true) => {
        if(this.isNoChats()) {
            this.setNoChats(false)
        }
        this.$el.classList.toggle("loading", value)

        this.loadingLottie.patch({
            hidden: !value
        })
        // if(this.loadingLottie.component.anim) {
            // value ? this.loadingLottie.component.play() : this.loadingLottie.component.pause()
        // }
    }

    setNoChats = (value = true) => {
        if(this.isLoading()) {
            this.setLoading(false)
        }
        // value ? this.noChatsLottie.component.play() : this.noChatsLottie.component.pause()
        this.$el.classList.toggle("no-chats", value)
        this.noChatsLottie.patch({
            hidden: !value
        })

    }

    onSelectFolder = (event) => {
        // console.log("select folder", event.folderId)
        this.selectedFolder = event.folderId
        this.folderRefs.forEach(l => {
            const component: DialogFolderFragment = l.component
            component.hidden = component.folderId !== this.selectedFolder
        })
        if(this.selectedFolder == null) {
            this.setLoading(false)
        } else {
            this.onGotMany()
        }
        // this.setState({
        //     selectedFolder: folderId
        // })
    }

}