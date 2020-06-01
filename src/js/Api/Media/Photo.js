// Photo is used both in messages and avatars, this was created to prevent copypaste
import {FileAPI} from "../Files/FileAPI";
import {ReactiveObject} from "../../V/Reactive/ReactiveObject";
import FileManager from "../Files/FileManager";

// this class is probably redundant
export class Photo extends ReactiveObject {
    thumbnail: string

    constructor(rawPhoto) {
        super()
        this.fillRaw(rawPhoto)
    }

    get fileId() {
        return this.raw.id
    }

    get loaded() {
        return FileManager.isDownloadedById(this.fileId)
    }

    get loading() {
        return FileManager.isPending(this.fileId)
    }

    get srcUrl() {
        return this.loaded && FileManager.downloaded.get(this.fileId).url
    }

    get date() {
        return this.raw.date
    }

    fetchMax() {
        return FileManager.downloadPhoto(this.raw).then(({url}) => {
            this.fire("downloaded", {url})

            return url
        })
    }

    fillRaw(raw: Object): Photo {
        this.raw = raw

        this.thumbnail = FileAPI.hasThumbnail(this.raw) ? FileAPI.getThumbnail(this.raw) : ""

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