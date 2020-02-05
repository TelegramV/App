import {DocumentMessagesTool} from "../../../../components/file/DocumentMessageTool"

export const DialogInfoDocumentComponent = ({document}) => {
    let doc = document;

    let title = DocumentMessagesTool.getFilename(doc.attributes);
    let ext = title.split(".")[title.split(".").length - 1];
    let size = DocumentMessagesTool.formatSize(doc.size);

    let color = DocumentMessagesTool.getColor(ext);
    let icon = (
        <div class="svg-wrapper">
            {DocumentMessagesTool.createIcon(color)}
            <div class="extension">{ext}</div>
        </div>
    )

    return (
        <div className="card details">
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