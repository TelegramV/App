import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {DocumentMessagesTool} from "../../../../Utils/document"
import FileManager from "../../../../../Api/Files/FileManager"
import CardMessageWrapperFragment from "./Common/CardMessageWrapperFragment"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import VSpinner from "../../../../Elements/VSpinner";
import {FileAPI} from "../../../../../Api/Files/FileAPI"
import DocumentParser from "../../../../../Api/Files/DocumentParser"

const IconFragment = ({document, isDownloading, isDownloaded, color, ext, progress = 0.0}) => {
    return (
        <div className="svg-wrapper">
            {
                FileAPI.hasThumbnail(document) ?
                    <div style={{
                        "width": "100%",
                        "height": "100%",
                    }} class={{thumbnail3px: !FileManager.isDownloaded(document)}}>
                        <img style={{
                            "width": "100%",
                            "height": "100%",
                            "object-fit": "cover",
                        }}
                             src={FileManager.isDownloaded(document) ? FileManager.getUrl(document) : FileAPI.getThumbnail(document)}
                             alt="Thumb"/>
                    </div>
                    :
                    DocumentMessagesTool.createIcon(color, !isDownloaded)
            }
            {
                isDownloaded ?
                    !FileAPI.hasThumbnail(document) && <div className="extension">{ext}</div>
                    :
                    <div className="progress extension">
                        {/* TODO move progress bar with pause to component*/}
                        {!isDownloading ? (
                                <div className="pause-button">
                                    <i className={["tgico tgico-download"]}/>
                                </div>
                            ) :
                            <VSpinner mid white determinate progress={progress / 100}>
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
            .filter(event => event.file.id === this.props.message.raw.media.document.id)
            .updateOn("download.start")
            .updateOn("download.newPart")
            .updateOn("download.done")
            .updateOn("download.canceled")
    }

    render({showDate}) {
        const document = this.props.message.raw.media.document;

        const title = DocumentMessagesTool.getFilename(document.attributes);
        const ext = title.split(".")[title.split(".").length - 1];

        const isDownloading = FileManager.isPending(document);
        const isDownloaded = FileManager.isDownloaded(document);
        const percentage = FileManager.getPercentage(document);
        const pendingSize = FileManager.getPendingSize(document);

        const size = isDownloading && !isDownloaded ? `${DocumentMessagesTool.formatSize(pendingSize)} / ${DocumentMessagesTool.formatSize(document.size)}` : DocumentMessagesTool.formatSize(document.size);

        const color = DocumentMessagesTool.getColor(ext);

        const icon = <IconFragment ext={ext}
                                   color={color}
                                   isDownloaded={isDownloaded}
                                   progress={percentage}
                                   isDownloading={isDownloading}
                                   document={document}/>;

        return (
            <CardMessageWrapperFragment message={this.props.message}
                                        icon={icon}
                                        title={title}
                                        description={size}
                                        bubbleRef={this.bubbleRef}
                                        onClick={this.downloadDocument}
                                        showDate={showDate}/>
        )
    }

    componentWillMount(props) {
        super.componentWillMount(props);

        if (!FileManager.isDownloaded(this.props.message.raw.media.document)) {
            FileManager.checkCache(this.props.message.raw.media.document);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.message.raw.media.document.id !== nextProps.message.raw.media.document.id) {
            if (!FileManager.isDownloaded(nextProps.message.raw.media.document)) {
                FileManager.checkCache(nextProps.message.raw.media.document);
            }
        }
    }

    downloadDocument = () => {
        const document = this.props.message.raw.media.document;

        if (FileManager.isDownloaded(document)) {
            FileManager.save(document.id, DocumentParser.attributeFilename(document))
        } else if (!FileManager.isPending(document)) {
            FileManager.downloadDocument(document)
        } else {
            FileManager.cancel(document)
        }
    }
}

export default DocumentMessageComponent;