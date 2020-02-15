import {TypedPublisher} from "../eventBus/TypedPublisher"
import {FileAPI} from "../fileAPI"
import AppEvents from "../eventBus/AppEvents"

class FilesManager extends TypedPublisher {

    pending = new Set()
    downloaded = new Set()

    downloadDocument = file => {
        FileAPI.getAllParts(file, file.size).then(x => {
            AppEvents.General.fire("fileDownloaded", {
                fileId: file.id,
                file: x
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