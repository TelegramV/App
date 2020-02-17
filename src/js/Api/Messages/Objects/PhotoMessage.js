// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import {FileAPI} from "../../Files/FileAPI"

export class PhotoMessage extends AbstractMessage {

    type = MessageType.PHOTO

    srcUrl = ""
    srcMaxSizeUrl = ""

    width = 0
    height = 0

    maxWidth = 0
    maxHeight = 0

    thumbnail = true
    loaded = false
    loading = true

    interrupted: false

    minSizeType = "" // why?
    maxSizeType = "" // why?

    show() {
        super.show()
        this.fetchMax()
    }

    get smallPreviewImage() {
        return this.srcUrl
    }

    fetchMax() {
        if (this.interrupted && this.loaded) {
            this.interrupted = false
            this.fire("photoLoaded")
            return
        }

        this.thumbnail = true
        this.loaded = false
        this.loading = true

        return FileAPI.getFile(this.raw.media.photo, this.maxSizeType).then(srcUrl => {
            this.srcUrl = srcUrl

            this.thumbnail = false
            this.loaded = true
            this.loading = false

            if (!this.interrupted) {
                this.interrupted = false
                this.fire("photoLoaded")
            }
        })
    }

    fetchMaxSize() {
        return FileAPI.getFile(this.raw.media.photo, this.minSizeType).then(srcMaxUrl => {
            this.srcMaxSizeUrl = srcMaxUrl

            if (!this.interrupted) {
                this.interrupted = false
                this.fire("maxSizeLoaded")
            }
        })
    }

    fillRaw(raw: Object): PhotoMessage {
        super.fillRaw(raw)

        this.srcUrl = FileAPI.hasThumbnail(this.raw.media.photo) ? FileAPI.getThumbnail(this.raw.media.photo) : ""

        const minSize = FileAPI.getMinSize(this.raw.media.photo)
        const maxSize = FileAPI.getMaxSize(this.raw.media.photo)

        this.width = minSize.w
        this.height = minSize.h
        this.minSizeType = minSize.type

        this.maxWidth = maxSize.w
        this.maxHeight = maxSize.h
        this.maxSizeType = maxSize.type

        return this
    }
}