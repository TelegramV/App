import {FileAPI} from "./FileAPI"
import AppEvents from "../EventBus/AppEvents"

class FilesManager {

    pending = new Map()
    downloaded = new Map()

    isPending(fileId) {
        return this.pending.has(fileId)
    }

    isDownloaded(fileId) {
        return this.downloaded.has(fileId)
    }

    getPercentage(fileId) {
        return this.pending.get(fileId)?._percentage ?? 0
    }

    getPendingSize(fileId) {
        return this.pending.get(fileId)?._downloadedSize ?? 0
    }

    get(fileId) {
        return this.downloaded.get(fileId)
    }

    cancel(fileId) {
        this.pending.delete(fileId)

        AppEvents.Files.fire("download.canceled", {
            file: {
                id: fileId, // todo: aaaaa
            }
        })
    }

    checkCache(file, size): Promise<Blob> | any {
        if (this.downloaded.has(file.id)) {
            const blob = this.downloaded.get(file.id);

            AppEvents.Files.fire("download.done", {
                file,
                blob,
            });

            return Promise.resolve(blob);
        }

        return FileAPI.tryFromCache(file, size).then(blob => this.internal_downloadDone(file, blob)).catch(error => {
            // console.error(error)
        })
    }

    downloadPhoto(photo, size): Promise<Blob> | any {
        if (this.downloaded.has(photo.id)) {
            const blob = this.downloaded.get(photo.id);

            AppEvents.Files.fire("download.done", {
                file: photo,
                blob,
            });

            return Promise.reject(blob);
        }

        if (this.pending.has(photo.id)) {
            return Promise.resolve(null);
        }

        this.internal_downloadStart(photo);

        return FileAPI.downloadPhoto(photo, size, event => this.internal_downloadNewPart(photo, event))
            .then(blob => this.internal_downloadDone(photo, blob));
    }

    downloadDocument(document, thumb): Promise<Blob> | any {
        if (this.downloaded.has(document.id)) {
            const blob = this.downloaded.get(document.id);

            AppEvents.Files.fire("download.done", {
                file: document,
                blob,
            });

            return Promise.resolve(blob);
        }

        if (this.pending.has(document.id)) {
            return Promise.reject(null);
        }

        this.internal_downloadStart(document);

        return FileAPI.downloadDocument(document, thumb, event => this.internal_downloadNewPart(document, event))
            .then(blob => this.internal_downloadDone(document, blob));
    }

    internal_downloadDone(file, blob) {
        file._percentage = 100;

        this.pending.delete(file.id);
        this.downloaded.set(file.id, blob);

        AppEvents.Files.fire("download.done", {
            file: file,
            blob,
        });

        return blob;
    }

    internal_downloadStart(file) {
        file._percentage = 0;
        file._downloadedSize = 0;

        this.pending.set(file.id, file)

        AppEvents.Files.fire("download.start", {
            file,
        });
    }

    internal_downloadNewPart(file, event) {
        const {newBytes, totalBytes, sizeToBeDownloaded, percentage} = event;

        file._percentage = percentage;
        file._downloadedSize = totalBytes.length;

        AppEvents.Files.fire("download.newPart", {
            file,
            newBytes,
            totalBytes,
            sizeToBeDownloaded,
            percentage
        });

        return !!this.pending.get(file.id); // cancel then
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