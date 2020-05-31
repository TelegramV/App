import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {DocumentMessagesTool} from "../../../../Utils/document"
import FileManager from "../../../../../Api/Files/FileManager"
import CardMessageWrapperFragment from "./Common/CardMessageWrapperFragment"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import VSpinner from "../../../Elements/VSpinner";
import {FileAPI} from "../../../../../Api/Files/FileAPI"

const IconFragment = ({document, isDownloading, isDownloaded, color, ext, progress = 0.0}) => {
    return (
        <div className="svg-wrapper">
            {
                FileAPI.hasThumbnail(document) ?
                    <div class="thumbnail3px">
                        <img style={{
                            "width": "100%"
                        }} src={FileAPI.getThumbnail(document)} alt="Thumb"/>
                    </div>
                    :
                    DocumentMessagesTool.createIcon(color, !isDownloaded)
            }
            {
                isDownloaded ?
                    <div className="extension">{ext}</div>
                    :
                    <div className="progress extension">
                        {/* TODO move progress bar with pause to component*/}
                        {!isDownloading ? (
                                <div className="pause-button">
                                    <i className={["tgico tgico-download"]}/>
                                </div>
                            ) :
                            <VSpinner white determinate progress={progress / 100}>
                                <i className={["tgico tgico-close"]}/>
                            </VSpinner>
                        }
                    </div>
            }
        </div>
    )
}

class DocumentMessageComponent extends GeneralMessageComponent {
    appEvents(E) {
        super.appEvents(E);

        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.message.raw.media.document.id)
            .updateOn("download.start")
            .updateOn("download.newPart")
            .updateOn("download.done")
            .updateOn("download.canceled")
    }

    render() {
        const document = this.message.raw.media.document;

        const title = DocumentMessagesTool.getFilename(document.attributes);
        const ext = title.split(".")[title.split(".").length - 1];

        const isDownloading = FileManager.isPending(document.id);
        const isDownloaded = FileManager.isDownloaded(document.id);
        const percentage = FileManager.getPercentage(document.id);
        const pendingSize = FileManager.getPendingSize(document.id);

        const size = isDownloading && !isDownloaded ? `${Math.round(percentage)}% / ${DocumentMessagesTool.formatSize(pendingSize)}` : DocumentMessagesTool.formatSize(document.size);

        const color = DocumentMessagesTool.getColor(ext);

        const icon = <IconFragment ext={ext}
                                   color={color}
                                   isDownloaded={isDownloaded}
                                   progress={percentage}
                                   isDownloading={isDownloading}
                                   document={document}/>;

        return (
            <CardMessageWrapperFragment message={this.message}
                                        icon={icon}
                                        title={title}
                                        description={size}
                                        bubbleRef={this.bubbleRef}
                                        onClick={this.downloadDocument}/>
        )
    }

    componentWillMount(props) {
        if (!FileManager.isDownloaded(this.message.raw.media.document.id)) {
            FileManager.checkCache(this.message.raw.media.document);
        }
    }

    downloadDocument = () => {
        const document = this.message.raw.media.document;

        if (FileManager.isDownloaded(document.id)) {
            FileManager.save(document.id, DocumentMessagesTool.getFilename(document.attributes))
        } else if (!FileManager.isPending(document.id)) {
            FileManager.downloadDocument(document)
        } else {
            FileManager.cancel(document.id)
        }
    }
}

export default DocumentMessageComponent;