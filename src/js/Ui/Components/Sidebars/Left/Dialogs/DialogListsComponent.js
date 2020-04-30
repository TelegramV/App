import VComponent from "../../../../../V/VRDOM/component/VComponent";
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent";
import GeneralDialogListComponent from "./Lists/GeneralDialogListComponent";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import type {AE} from "../../../../../V/VRDOM/component/__component_registerAppEvents";
import classIf from "../../../../../V/VRDOM/jsx/helpers/classIf";
import MTProto from "../../../../../MTProto/External";
import lottie from "../../../../../../../vendor/lottie-web";

const DialogFolderFragment = ({folderId, filter, selected}) => {
    return <div class={classIf(!selected, "hidden")}>
        <PinnedDialogListComponent folderId={folderId} filter={filter}/>
        <GeneralDialogListComponent folderId={folderId} filter={filter}/>
    </div>
}

// FIXME since this elements patches if the folder is changed, it removes all the dialogs added with append. To rewrite.
export class DialogListsComponent extends VComponent {
    state = {
        folders: [],
        selectedFolder: null
    }

    appEvents(E: AE) {
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.onFoldersUpdate)
            .on("selectFolder", this.onSelectFolder)
    }

    render() {
        return <div className="dialog-lists">
            {/*<div className="empty"/>*/}
            {/* All chats */}
            <DialogFolderFragment folderId={null} filter={null} selected={this.state.selectedFolder == null}/>
            {this.state.folders.map(l => {
                return <DialogFolderFragment folderId={l.id} filter={l} selected={this.state.selectedFolder === l.id}/>
            })}
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

    onFoldersUpdate = (event) => {
        this.state.folders = []
        this.setState({
            folders: event.folders
        })
    }

    onSelectFolder = (event) => {
        // console.log("select folder", event.folderId)
        const folderId = event.folderId
        this.setState({
            selectedFolder: folderId
        })
    }

}