import {DocumentMessagesTool} from "../../../../../Utils/document"
import StatelessComponent from "../../../../../../V/VRDOM/component/StatelessComponent"
import FileManager from "../../../../../../Api/Files/FileManager"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {FileAPI} from "../../../../../../Api/Files/FileAPI"
import DocumentParser from "../../../../../../Api/Files/DocumentParser"

class DialogInfoDocumentComponent extends StatelessComponent {
    appEvents(E: AE) {
        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.props.document.id)
            .updateOn("download.start")
            .updateOn("download.newPart")
            .updateOn("download.done")
            .updateOn("download.canceled")
    }

    render({document}) {
        const isDownloading = FileManager.isPending(document.id);
        const isDownloaded = FileManager.isDownloaded(document.id);

        const title = DocumentMessagesTool.getFilename(document.attributes);
        const ext = title.split(".")[title.split(".").length - 1];
        const percentage = FileManager.getPercentage(document.id);
        const pendingSize = FileManager.getPendingSize(document.id);

        const size = isDownloading && !isDownloaded ? `${Math.round(percentage)}% / ${DocumentMessagesTool.formatSize(pendingSize)}` : DocumentMessagesTool.formatSize(document.size);

        const color = DocumentMessagesTool.getColor(ext);

        const icon = (
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

        return (
            <div className="card details rp" onClick={this.downloadDocument}
                 css-cursor="pointer">
                <div className="card-icon">
                    {icon}
                </div>
                <div className="card-info">
                    <div className="title">
                        {title}
                    </div>
                    <div className="description">
                        {size}
                    </div>
                </div>
            </div>
        )
    }

    componentWillMount(props) {
        if (!FileManager.isDownloaded(this.props.document.id)) {
            FileManager.checkCache(this.props.document);
        }
    }

    downloadDocument = () => {
        const document = this.props.document;

        if (FileManager.isDownloaded(document.id)) {
            FileManager.save(document.id, DocumentParser.attributeFilename(document))
        } else if (!FileManager.isPending(document.id)) {
            FileManager.downloadDocument(document)
        } else {
            FileManager.cancel(document.id)
        }
    }
}

export default DialogInfoDocumentComponent