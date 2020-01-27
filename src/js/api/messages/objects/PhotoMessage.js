// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import {FileAPI} from "../../fileAPI"

export class PhotoMessage extends AbstractMessage {

    type = MessageType.PHOTO

    srcUrl = ""

    width = 0
    height = 0

    thumbnail = true
    loaded = false
    loading = 1

    maxSizeType = "" // why?

    show() {
        this.fetchMax()
    }

    fetchMax() {
        this.thumbnail = true
        this.loaded = false
        this.loading = 1

        FileAPI.getFile(this.raw.media.photo, this.maxSizeType).then(srcUrl => {
            this.srcUrl = srcUrl

            this.thumbnail = false
            this.loaded = true
            this.loading = false

            this.fire("photoLoaded")
        })
    }

    fillRaw(raw: Object): PhotoMessage {
        super.fillRaw(raw)

        this.srcUrl = FileAPI.hasThumbnail(this.raw.media.photo) ? FileAPI.getThumbnail(this.raw.media.photo) : ""

        const maxSize = FileAPI.getMaxSize(this.raw.media.photo)

        this.width = maxSize.w
        this.height = maxSize.h
        this.maxSizeType = maxSize.type

        return this
    }
}