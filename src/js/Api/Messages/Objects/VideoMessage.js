import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import {FileAPI} from "../../Files/FileAPI"

// TOdo: REWRITE!!!!!!!!!!!!!!!!!!!!!!
export class VideoMessage extends AbstractMessage {

    type = MessageType.VIDEO

    thumbUrl = ""
    videoUrl = ""

    videoInfo = undefined

    loaded = false
    loading = false

    interrupted: false

    show() {
        super.show()
        // this.fetchThumb();
    }

    fillRaw(raw: Object) {
        super.fillRaw(raw);
        // this.videoInfo = FileAPI.getMaxSize(this.raw.media.document);
        return this;
    }
}