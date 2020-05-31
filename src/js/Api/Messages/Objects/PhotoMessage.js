// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import {Photo} from "../../Media/Photo";

export class PhotoMessage extends AbstractMessage {
    type = MessageType.PHOTO

    photo: Photo

    show() {
        super.show()
        this.fetchMax()
    }

    get srcUrl() {
        return this.photo.srcUrl
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

    fillRaw(raw: Object): PhotoMessage {
        super.fillRaw(raw)

        this.photo = new Photo(raw.media.photo)

        return this
    }
}