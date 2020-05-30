import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {DocumentMessagesTool} from "../../../../Utils/document"
import FileManager from "../../../../../Api/Files/FileManager"
import CardMessageWrapperFragment from "./Common/CardMessageWrapperFragment"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import VSpinner from "../../../Elements/VSpinner";
import {FileAPI} from "../../../../../Api/Files/FileAPI"

const IconFragment = ({document, isDownloading, isDownloaded, color, ext, progress = 0.0}) => {
    return (
        <div className="svg-wrapper">
            {FileAPI.hasThumbnail(document) ?
                <div class="thumbnail3px">
                    <img style={{
                        "width": "100%"
                    }} src={FileAPI.getThumbnail(document)}/>
                </div> : DocumentMessagesTool.createIcon(color, !isDownloaded)}
            {
                isDownloaded ?
                    <div className="extension">{ext}</div> :
                    <div className="progress extension">

                        {/* TODO move progress bar with pause to component*/}
                        {!isDownloading ? (
                                <div className="pause-button">
                                    <i className={["tgico tgico-download"]}/>
                                </div>
                            ) :
                            <VSpinner white determinate progress={progress}>
                                <i className={["tgico tgico-close"]}/>
                            </VSpinner>
                        }
                    </div>
            }
        </div>
    )
}

class DocumentMessageComponent extends GeneralMessageComponent {

    iconFragmentRef = VComponent.createFragmentRef()

    appEvents(E) {
        super.appEvents(E)
        // TODO check this!
        E.bus(AppEvents.Files)
            .filter(event => event.fileId === this.doc.id)
            .on("fileDownloaded", this.onFileDownloaded)
            .on("fileDownloading", this.onFileDownloading)
    }

    render() {
        this.doc = this.message.raw.media.document
        let doc = this.message.raw.media.document;

        let title = DocumentMessagesTool.getFilename(doc.attributes);
        let ext = title.split(".")[title.split(".").length - 1];

        const isDownloading = FileManager.isPending(doc.id)
        const isDownloaded = FileManager.isDownloaded(doc.id)
        const progress = FileManager.getProgress(doc.id)
        let size = isDownloading && !isDownloaded ? Math.round(progress * 100) + "%" : DocumentMessagesTool.formatSize(doc.size);

        let color = DocumentMessagesTool.getColor(ext);
        let icon = <IconFragment ref={this.iconFragmentRef}
                                 ext={ext}
                                 color={color}
                                 isDownloaded={isDownloaded}
                                 progress={progress}
                                 isDownloading={isDownloading}
                                 document={doc}/>;

        return (
            <CardMessageWrapperFragment message={this.message}
                                        icon={icon}
                                        title={title}
                                        description={size}
                                        bubbleRef={this.bubbleRef}
                                        onClick={this.downloadDocument}/>
        )
    }

    downloadDocument = () => {
        if (FileManager.isDownloaded(this.doc.id)) {
            FileManager.saveBlobUrlOnPc(FileManager.downloaded.get(this.doc.id), DocumentMessagesTool.getFilename(this.doc.attributes))
        } else if (!FileManager.isPending(this.doc.id)) {
            FileManager.downloadDocument(this.doc)
        } else {
            // TODO Possible RC if cancel and redownloaded at the same time.
            // Should probably store some random hash of the download in FileMgr.pending?
            AppEvents.Files.fire("cancelDownload", this.doc.id)
            this.iconFragmentRef.patch({
                isDownloading: false,
                progress: 0.0
            })
            // TODO should definitely be replaced with stateful component
            this.forceUpdate()
        }
    }

    onFileDownloading = event => {
        if (this.doc.id === event.fileId) {

            this.iconFragmentRef.patch({
                isDownloading: true,
                progress: event.progress
            })
            // TODO should definitely be replaced with stateful component
            this.forceUpdate()
        }
    }

    onFileDownloaded = event => {
        if (this.doc.id === event.fileId) {

            this.iconFragmentRef.patch({
                isDownloading: false,
                isDownloaded: true,
            })

            // TODO should definitely be replaced with stateful component
            this.forceUpdate()
        }
    }
}

export default DocumentMessageComponent;