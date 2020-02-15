import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {DocumentMessagesTool} from "../../file/DocumentMessageTool"
import FileManager from "../../../../../../api/files/FileManager"
import CardMessageWrapperFragment from "./common/CardMessageWrapperFragment"
import VComponent from "../../../../../v/vrdom/component/VComponent"
import AppEvents from "../../../../../../api/eventBus/AppEvents"

const IconFragment = ({isDownloading, isDownloaded, color, ext}) => {
    return (
        <div className="svg-wrapper">
            {DocumentMessagesTool.createIcon(color)}
            {
                isDownloaded ?
                    <div className="extension">{ext}</div> :
                    <div className="progress extension">
                        {!isDownloading ? <div className="pause-button">
                                <i className={["tgico tgico-download"]}/>
                            </div> :
                            <progress className={["progress-circular", "white"]}/>}
                    </div>
            }
        </div>
    )
}

class DocumentMessageComponent extends GeneralMessageComponent {

    isDownloading = false
    isDownloaded = false
    downloadedFile = undefined

    iconFragmentRef = VComponent.createFragmentRef()

    appEvents(E) {
        super.appEvents(E)
        E.bus(AppEvents.General)
            .on("fileDownloaded", this.onFileDownloaded)
            .on("fileDownloading", this.onFileDownloading)
    }

    h() {
        this.doc = this.message.raw.media.document
        let doc = this.message.raw.media.document;

        let title = DocumentMessagesTool.getFilename(doc.attributes);
        let ext = title.split(".")[title.split(".").length - 1];
        let size = DocumentMessagesTool.formatSize(doc.size);

        let color = DocumentMessagesTool.getColor(ext);
        let icon = <IconFragment ref={this.iconFragmentRef}
                                 ext={ext}
                                 color={color}
                                 isDownloaded={this.isDownloaded}
                                 isDownloading={FileManager.pending.has(doc.id)}/>


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
        if (this.isDownloaded && this.downloadedFile) {
            FileManager.saveOnPc(this.downloadedFile, DocumentMessagesTool.getFilename(this.doc.attributes))
        } else if (!this.isDownloading) {
            FileManager.downloadDocument(this.doc)
        }
    }

    onFileDownloading = event => {
        if (this.doc.id === event.fileId && !this.isDownloaded) {
            this.isDownloading = true

            this.iconFragmentRef.patch({
                isDownloading: true,
            })
        }
    }

    onFileDownloaded = event => {
        if (this.doc.id === event.fileId) {
            this.isDownloaded = true
            this.isDownloading = false
            this.downloadedFile = event.file

            this.iconFragmentRef.patch({
                isDownloading: false,
                isDownloaded: true,
            })
        }
    }
}

export default DocumentMessageComponent;