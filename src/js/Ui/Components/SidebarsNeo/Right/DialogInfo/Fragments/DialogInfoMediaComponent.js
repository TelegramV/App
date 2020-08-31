import StatefulComponent from "../../../../../../V/VRDOM/component/StatefulComponent";
import { FileAPI } from "../../../../../../Api/Files/FileAPI";
import FileManager from "../../../../../../Api/Files/FileManager";
import BetterPhotoComponent from "../../../../Basic/BetterPhotoComponent";
import { MessageType } from "../../../../../../Api/Messages/Message"
import DocumentParser from "../../../../../../Api/Files/DocumentParser"
import { formatTime } from "../../../../../../Utils/date";
import UIEvents from "../../../../../EventBus/UIEvents";

export default class DialogInfoMediaComponent extends StatefulComponent {

    state = {
        thumbUrl: "",
        maxThumb: false
    }

    render({ message }) {
        if (message.type === MessageType.VIDEO) {
            this.isVideo = true
            const video = DocumentParser.attributeVideo(message.media.document)

            return (
                <div class="media-wrapper">
                    <figure css-cursor="pointer" className="photo video-thumb rp"
                            onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: message})}>
                        <img src={this.state.thumbUrl} className={[!this.state.maxThumb && "blur"]}alt="video"/>
                        <div className="video-info-bar">
                            {formatTime(video.duration)}
                        </div>
                    </figure>
                </div>
            )
        } else {
            return (
                <div class="media-wrapper">
                    <BetterPhotoComponent photo={message.raw.media.photo || message.raw.media}
                                          onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: message})}/>
                </div>
            )
        }
    }

    componentDidMount() {
        if (this.isVideo) {
            if (!this.state.thumbUrl) {
                this.setState({
                    thumbUrl: FileAPI.getThumbnail(this.props.message.raw.media.document)
                })
            }
            const document = this.props.message.media.document
            FileManager.downloadDocument(document,
                FileAPI.getMaxSize(document), { type: "image/jpeg" }
            ).then(({ url }) => {
                this.setState({
                    thumbUrl: url,
                    maxThumb: true
                })
            });
        }
    }
}