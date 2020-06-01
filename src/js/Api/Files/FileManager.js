import {FileAPI} from "./FileAPI"
import AppEvents from "../EventBus/AppEvents"

class FilesManager {

    pending = new Map()
    downloaded: Map<string, { blob: Blob; url: string; }> = new Map()

    isPending(fileId) {
        return this.pending.has(fileId)
    }

    isDownloaded(fileId) {
        return this.downloaded.has(fileId)
    }

    getPercentage(fileId) {
        return this.pending.get(fileId)?._percentage ?? 100
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
            const downloaded = this.downloaded.get(file.id);

            AppEvents.Files.fire("download.done", {
                file,
                blob: downloaded.blob,
                url: downloaded.url,
            });

            return Promise.resolve(downloaded);
        }

        return FileAPI.tryFromCache(file, size).then(blob => this.internal_downloadDone(file, blob)).catch(error => {
            // console.error(error)
        })
    }

    downloadPhoto(photo, size): Promise<Blob> | any {
        if (this.downloaded.has(photo.id)) {
            const downloaded = this.downloaded.get(photo.id);

            AppEvents.Files.fire("download.done", {
                file: photo,
                blob: downloaded.blob,
                url: downloaded.url,
            });

            return Promise.resolve(downloaded);
        }

        if (this.pending.has(photo.id)) {
            return this.pending.get(photo.id)._promise;
        }

        this.internal_downloadStart(photo);

        return photo._promise = FileAPI.downloadPhoto(photo, size, event => this.internal_downloadNewPart(photo, event))
            .then(blob => this.internal_downloadDone(photo, blob));
    }

    downloadDocument(document, thumb): Promise<Blob> | any {
        const id = thumb ? `${document.id}_${thumb.id}` : document.id;

        if (this.downloaded.has(id)) {
            const downloaded = this.downloaded.get(id);

            AppEvents.Files.fire("download.done", {
                file: document,
                blob: downloaded.blob,
                url: downloaded.url,
            });

            return Promise.resolve(downloaded);
        }

        if (this.pending.has(id)) {
            return this.pending.get(id)._promise;
        }

        this.internal_downloadStart(document);

        return document._promise = FileAPI.downloadDocument(document, thumb, event => this.internal_downloadNewPart(document, event))
            .then(blob => this.internal_downloadDone(document, blob));
    }

    internal_downloadDone(file, blob) {
        file._percentage = 100;

        const downloaded = {
            id: file.id,
            blob,
            url: URL.createObjectURL(blob),
        };

        this.pending.delete(file.id);
        this.downloaded.set(file.id, downloaded);

        AppEvents.Files.fire("download.done", {
            file: file,
            blob,
            url: downloaded.url,
        });

        file._promise = Promise.resolve(downloaded);

        return downloaded;
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

    save(fileId, fileName) {
        const url = this.get(fileId).url

        this.saveBlobUrlOnPc(url, fileName)
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