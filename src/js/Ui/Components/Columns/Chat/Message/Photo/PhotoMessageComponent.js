import MessageWrapperFragment from "../Common/MessageWrapperFragment"
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import {PhotoMessage} from "../../../../../../Api/Messages/Objects/PhotoMessage"
import {PhotoFigureFragment} from "./PhotoFigureFragment"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import VUI from "../../../../../VUI"
import UIEvents from "../../../../../EventBus/UIEvents";
import AppEvents from "../../../../../../Api/EventBus/AppEvents";
import FileManager from "../../../../../../Api/Files/FileManager";

const MessagePhotoFigureFragment = ({message, clickLoader, click, progress = 0.0, pending, downloaded}) => {
    return (
        <PhotoFigureFragment srcUrl={message.srcUrl}
                             thumbnail={message.thumbnail}
                             width={message.maxWidth}
                             height={message.maxHeight}
                             maxWidth={message.text.length === 0 ? 480 : 470}
                             maxHeight={512}
                             loading={pending}
                             loaded={downloaded}
                             progress={progress}
                             clickLoader={clickLoader}
                             click={click}/>
    )
}

class PhotoMessageComponent extends GeneralMessageComponent {

    message: PhotoMessage

    photoFigureRef = VComponent.createFragmentRef()

    appEvents(E) {
        E.bus(AppEvents.Files)
            .only(event => event.fileId === this.message.raw.media.photo.id)
            .on("fileDownloaded", this.onFileDownloaded)
            .on("fileDownloading", this.onFileDownloading)
    }

    render() {
        const isDownloaded = FileManager.isDownloaded(this.message.raw.media.photo.id)
        const isPending = FileManager.isPending(this.message.raw.media.photo.id)
        const progress = FileManager.getProgress(this.message.raw.media.photo.id)
        const text = (this.message.text.length > 0) ? <TextWrapperComponent message={this.message}/> : ""
        return (
            <MessageWrapperFragment message={this.message} noPad showUsername={false} outerPad={text !== ""}
                                    avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>
                <MessagePhotoFigureFragment ref={this.photoFigureRef}
                                            message={this.message} progress={progress} pending={isPending} downloaded={isDownloaded}
                                            clickLoader={this.toggleLoading} click={this.openMediaViewer}/>
                {!text ? <MessageTimeComponent message={this.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }

    openMediaViewer = event => {
        UIEvents.MediaViewer.fire("showMessage", this.message)
        // VUI.MediaViewer.open(this.message)
    }

    onFileDownloaded = event => {
        this.patchFigure()
    }

    onFileDownloading = event => {
        this.patchFigure()
    }

    patchFigure = () => {
        this.photoFigureRef.patch({
            message: this.message,
            progress: FileManager.getProgress(this.message.raw.media.photo.id),
            pending: FileManager.isPending(this.message.raw.media.photo.id),
            downloaded: FileManager.isDownloaded(this.message.raw.media.photo.id),
            clickLoader: this.toggleLoading
        })
    }

    toggleLoading = (ev) => {
        if(FileManager.isDownloaded(this.message.raw.media.photo.id)) return
        ev.stopPropagation()
        if(FileManager.isPending(this.message.raw.media.photo.id)) {
            AppEvents.Files.fire("cancelDownload", this.message.raw.media.photo.id)
        } else {
            this.message.fetchMax()
        }
        this.patchFigure()
        // TODO toggle loading
        // if (this.message.loading) {
        //     this.message.loading = false
        //     this.message.interrupted = true
        // } else {
        //     this.message.fetchMax()
        // }
        //
        // this.patchFigure()
    }

    componentWillUnmount() {
        this.photoFigureRef.$el = null
        this.photoFigureRef.fragment = null
    }
}

export default PhotoMessageComponent