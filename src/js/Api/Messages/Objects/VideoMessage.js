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
        this.fetchThumb();
    }

    get smallThumb() {
        return FileAPI.hasThumbnail(this.raw.media.document) ? FileAPI.getThumbnail(this.raw.media.document) : "";
    }

    get thumbnail() {
        return this.thumbUrl;
    }

    get videoUrl() {
        return this.videoUrl;
    }

    get videoInfo() {
        return this.videoInfo;
    }

    fetchFullVideo() {
        if (this.interrupted && this.loaded) {
            this.interrupted = false
            this.fire("videoDownloaded")
            return
        }

        this.loaded = false
        this.loading = true
        return FileAPI.getFile(this.raw.media.document).then(url => {
            this.videoUrl = url;

            this.loaded = true
            this.loading = false

            if (!this.interrupted) {
                this.interrupted = false
                this.fire("videoDownloaded")
            }
        })
    }

    fetchThumb() {
        FileAPI.getThumb(this.raw.media.document, FileAPI.getMaxSize(this.raw.media.document, true).type).then(url => {
            this.thumbUrl = url;
            this.fire("thumbDownloaded")
        })
    }

    fillRaw(raw: Object) {
        super.fillRaw(raw);
        this.videoInfo = FileAPI.getMaxSize(this.raw.media.document);
        return this;
    }
}