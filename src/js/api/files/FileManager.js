import {FileAPI} from "../fileAPI"
import AppEvents from "../eventBus/AppEvents"

class FilesManager {

    pending = new Set()
    downloaded = new Map()

    downloadDocument = file => {
        if (this.pending.has(file.id)) {
            return Promise.reject()
        }

        this.pending.add(file.id)

        AppEvents.General.fire("fileDownloading", {
            fileId: file.id,
            raw: file
        })

        FileAPI.getAllParts(file, file.size).then(x => {
            this.pending.delete(file.id)

            AppEvents.General.fire("fileDownloaded", {
                fileId: file.id,
                file: x,
                raw: file
            })
        })
    }

    saveOnPc = (data, fileName) => {
        this.saveBlobOnPc(new Blob(data, {type: "octet/stream"}), fileName)
    }

    saveBlobOnPc = (blob, fileName) => {
        const a = document.createElement("a")
        document.body.appendChild(a)
        a.style = "display: none"
        const url = URL.createObjectURL(blob)
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
        a.remove()
    }
}

const FileManager = new FilesManager()

export default FileManager