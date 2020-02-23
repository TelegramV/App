import {DocumentMessagesTool} from "../../../../file/DocumentMessageTool"

export const DialogInfoDocumentComponent = ({document, isDownloading, isDownloaded, onClick}) => {
    let doc = document;

    let title = DocumentMessagesTool.getFilename(doc.attributes);
    let ext = title.split(".")[title.split(".").length - 1];
    let size = DocumentMessagesTool.formatSize(doc.size);

    let color = DocumentMessagesTool.getColor(ext);
    let icon = (
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

    return (
        <div className="card details" id={`medidoc-${document.id}`} onClick={onClick} css-cursor="pointer">
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