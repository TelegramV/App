import {FileAPI} from "./FileAPI"
import AppEvents from "../EventBus/AppEvents"

class FilesManager {

    pending = new Map()
    // TODO should definitely use cache here, storing in RAM is awful
    downloaded = new Map()

    constructor() {
        AppEvents.Files.subscribe("cancelDownload", this.onCancelDownload)
    }

    onCancelDownload = fileId => {
        // TODO cancel download
        this.pending.delete(fileId)
    }

    isPending = fileId => {
        return this.pending.has(fileId)
    }

    isDownloaded = fileId => {
        return this.downloaded.has(fileId)
    }

    getProgress = fileId => {
        return this.isDownloaded(fileId) ? 1.0 : (this.pending.get(fileId)?.progress ?? 0.0)
    }

    // shouldn't be async, or use await
    downloadPhoto = async (photo, thumbSize = undefined) => {
        return this.downloadDocument(photo, thumbSize)
    }

    downloadDocument = async (file, thumbSize = undefined) => {
        if (this.pending.has(file.id)) {
            return false
        }

        file.progress = 0.0
        this.pending.set(file.id, file)

        AppEvents.Files.fire("fileDownloading", {
            fileId: file.id,
            raw: file,
            progress: 0
        })

        const size = file.size || (file.thumbs || file.sizes).find(l => l.type === thumbSize).size
        let offset = 0
        const parts = []

        while (offset < size) {
            if (!this.pending.has(file.id)) {
                //reject("Cancelled by user")
                console.info("Cancelled by user download")
                // Cancelled by user
                return false
            }

            let response = await FileAPI.getFileLocation({
                _: FileAPI.getInputName(file),
                id: file.id,
                access_hash: file.access_hash,
                file_reference: file.file_reference,
                thumb_size: thumbSize
            }, file.dc_id, offset)

            if (!response.bytes) {
                console.error("Fatal error while loading part", response, file, offset, size)
            }

            offset += response.bytes.length
            parts.push(response.bytes)

            AppEvents.Files.fire("fileDownloading", {
                fileId: file.id,
                raw: file,
                progress: offset / size
            })
            const k = this.pending.get(file.id)
            if (k) {
                k.progress = offset / size
            }
        }

        // Can be cancelled here?


        const url = FileAPI.createBlobFromParts(file, file.mime_type || "application/jpeg", parts)

        this.pending.delete(file.id)
        this.downloaded.set(file.id, url)

        AppEvents.Files.fire("fileDownloaded", {
            fileId: file.id,
            file: parts,
            raw: file
        })

        // Backwards compatibility
        return url

        // FileAPI.getAllParts(file, file.size).then(x => {
        //     this.pending.delete(file.id)
        //
        //     AppEvents.Files.fire("fileDownloaded", {
        //         fileId: file.id,
        //         file: x,
        //         raw: file
        //     })
        // })
    }

    saveOnPc = (data, fileName) => {
        this.saveBlobOnPc(new Blob(data, {type: "octet/stream"}), fileName)
    }

    saveBlobOnPc = (blob, fileName) => {
        const url = URL.createObjectURL(blob)

        this.saveBlobUrlOnPc(url, fileName)
        URL.revokeObjectURL(url)

    }

    saveBlobUrlOnPc = (url, fileName) => {
        const a = document.createElement("a")
        document.body.appendChild(a)
        a.style = "display: none"
        a.href = url
        a.download = fileName
        a.click()
        a.remove()
    }
}

const FileManager = new FilesManager()

export default FileManager