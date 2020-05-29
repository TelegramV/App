// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import {Photo} from "../../Media/Photo";

export class PhotoMessage extends AbstractMessage {

    type = MessageType.PHOTO

    photo: Photo

    get srcUrl() {
        return this.photo.srcUrl
    }

    get srcMaxSizeUrl() {
        return this.photo.srcMaxSizeUrl
    }

    get minSizeType() {
        return this.photo.minSizeType
    }

    get maxSizeType() {
        return this.photo.maxSizeType
    }

    get thumbnail() {
        return this.photo.thumbnail
    }

    get loaded() {
        return this.photo.loaded
    }

    get loading() {
        return this.photo.loading
    }

    get interrupted() {
        return this.photo.interrupted
    }

    get maxWidth() {
        return this.photo.maxWidth
    }

    get maxHeight() {
        return this.photo.maxHeight
    }

    get width() {
        return this.photo.width
    }

    get height() {
        return this.photo.height
    }


    show() {
        super.show()
        this.fetchMax()
    }

    get smallPreviewImage() {
        return this.srcUrl
    }

    get isDisplayedInMediaViewer(): boolean {
        return true
    }

    fetchMax() {
        if (!this.photo) {
            return Promise.reject()
        }
        return this.photo.fetchMax()
    }

    // fetchMaxSize() {
    //     return this.photo.fetchMaxSize()
    // }

    fillRaw(raw: Object): PhotoMessage {
        super.fillRaw(raw)

        if (!raw.media) {
            console.warn("FUCK", this)
        }

        this.photo = new Photo(raw.media.photo)

        return this
    }
}