// Photo is used both in messages and avatars, this was created to prevent copypaste
import {FileAPI} from "../Files/FileAPI";
import {ReactiveObject} from "../../V/Reactive/ReactiveObject";
import FileManager from "../Files/FileManager";

export class Photo extends ReactiveObject {
    thumbnail: string

    constructor(rawPhoto) {
        super()
        this.raw = rawPhoto
        this.fillRaw(this.raw)
    }

    get fileId() {
        return this.raw.id
    }

    get loaded() {
        return FileManager.isDownloaded(this.fileId)
    }

    get loading() {
        return FileManager.isPending(this.fileId)
    }

    get srcUrl() {
        return this.loaded && FileManager.downloaded.get(this.fileId)
    }

    get date() {
        return this.raw.date
    }

    fetchMax() {
        return FileManager.downloadDocument(this.raw, this.maxSizeType, true)

        // return FileAPI.getFile(this.raw, this.maxSizeType).then(srcUrl => {
        //     this.srcUrl = srcUrl
        //
        //     this.thumbnail = false
        //     this.loaded = true
        //     this.loading = false
        //
        //     if (!this.interrupted) {
        //         this.interrupted = false
        //         this.fire("photoLoaded")
        //     }
        // })
    }

    // fetchMaxSize() {
    //     return FileAPI.getFile(this.raw, this.minSizeType).then(srcMaxUrl => {
    //         this.srcMaxSizeUrl = srcMaxUrl
    //
    //         if (!this.interrupted) {
    //             this.interrupted = false
    //             // this.fire("maxSizeLoaded")
    //         }
    //     })
    // }

    fillRaw(raw: Object): Photo {
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