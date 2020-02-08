import GeneralMessageComponent from "./common/GeneralMessageComponent"
import CardMessageWrapperFragment from "./common/CardMessageWrapperFragment"
import {DocumentMessagesTool} from "../../file/DocumentMessageTool"

class DocumentMessageComponent extends GeneralMessageComponent {

    h() {
        let doc = this.message.raw.media.document;

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
            <CardMessageWrapperFragment message={this.message} icon={icon} title={title} description={size}
                                        bubbleRef={this.bubbleRef}/>
        )
    }
}

export default DocumentMessageComponent;