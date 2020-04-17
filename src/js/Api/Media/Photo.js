// Photo is used both in messages and avatars, this was created to prevent copypaste
import {FileAPI} from "../Files/FileAPI";
import {ReactiveObject} from "../../V/Reactive/ReactiveObject";

export class Photo extends ReactiveObject {
    constructor(rawPhoto) {
        super()
        this.raw = rawPhoto
        this.fillRaw(this.raw)
    }

    get date() {
        return this.raw.date
    }

    fetchMax() {
        if (this.interrupted && this.loaded) {
            this.interrupted = false
            this.fire("photoLoaded")
            return Promise.resolve()
        }

        this.thumbnail = true
        this.loaded = false
        this.loading = true

        return FileAPI.getFile(this.raw, this.maxSizeType).then(srcUrl => {
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
        return FileAPI.getFile(this.raw, this.minSizeType).then(srcMaxUrl => {
            this.srcMaxSizeUrl = srcMaxUrl

            if (!this.interrupted) {
                this.interrupted = false
                this.fire("maxSizeLoaded")
            }
        })
    }

    fillRaw(raw: Object): Photo {
        this.srcUrl = FileAPI.hasThumbnail(this.raw) ? FileAPI.getThumbnail(this.raw) : ""

        const minSize = FileAPI.getMinSize(this.raw)
        const maxSize = FileAPI.getMaxSize(this.raw)

        this.width = minSize.w
        this.height = minSize.h
        this.minSizeType = minSize.type

        this.maxWidth = maxSize.w
        this.maxHeight = maxSize.h
        this.maxSizeType = maxSize.type

        return this
    }
}