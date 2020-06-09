import {FileAPI} from "./FileAPI"
import AppEvents from "../EventBus/AppEvents"

class FilesManager {

    pending = new Map()
    downloaded: Map<string, { url?: string; }> = new Map()

    isPending(file, thumbOrSize) {
        return this.pending.has(file.id)
    }

    isDownloaded(file, thumbOrSize) {
        return this.downloaded.has(file.id)
    }

    getPercentage(file, thumbOrSize) {
        return this.pending.get(file.id)?._percentage ?? 100
    }

    getPendingSize(file, thumbOrSize) {
        return this.pending.get(file.id)?._downloadedBytes?.length ?? 0
    }

    get(file, thumbOrSize) {
        return this.downloaded.get(file.id)
    }

    getUrl(file, thumbOrSize) {
        return this.get(file, thumbOrSize)?.url
    }

    getById(fileId, thumbOrSize) {
        return this.downloaded.get(fileId)
    }

    download(file, thumbOrSize, options): Promise<Blob> | any {
        switch (file._) {
            case "photo":
                return this.downloadPhoto(file, thumbOrSize, options);
            case "document":
                return this.downloadPhoto(file, thumbOrSize, options);

            default:
                return Promise.reject("Unsupported type: ", file._);
        }
    }

    cancel(file, thumbOrSize) {
        this.pending.delete(file.id)

        AppEvents.Files.fire("download.canceled", {
            file: file,
        })
    }

    checkCache(file, thumbOrSize): Promise<Blob> | any {
        if (this.downloaded.has(file.id)) {
            const downloaded = this.get(file, thumbOrSize);

            fetch(downloaded.url).then(r => r.blob()).then(blob => {
                AppEvents.Files.fire("download.done", {
                    file,
                    blob: blob,
                    url: downloaded.url,
                });
            });

            return Promise.resolve(downloaded);
        }

        return FileAPI.tryFromCache(file, thumbOrSize).then(blob => this.internal_downloadDone(file, blob)).catch(error => {
            // console.error(error)
        })
    }

    downloadPhoto(photo, size, options): Promise<Blob> | any {
        if (this.downloaded.has(photo.id)) {
            const downloaded = this.downloaded.get(photo.id);

            fetch(downloaded.url).then(r => r.blob()).then(blob => {
                AppEvents.Files.fire("download.done", {
                    file: photo,
                    blob: blob,
                    url: downloaded.url,
                });
            });

            return Promise.resolve(downloaded);
        }

        if (this.pending.has(photo.id)) {
            return this.pending.get(photo.id)._promise;
        }

        this.internal_downloadStart(photo);

        return photo._promise = FileAPI.downloadPhoto(photo, size, event => this.internal_downloadNewPart(photo, event), options)
            .then(blob => this.internal_downloadDone(photo, blob));
    }

    downloadDocument(document, thumb, options): Promise<Blob> | any {
        // const id = thumb ? `${document.id}_${thumb.id}` : document.id;
        const id = document.id;

        if (this.downloaded.has(id)) {
            const downloaded = this.downloaded.get(id);

            fetch(downloaded.url).then(r => r.blob()).then(blob => {
                AppEvents.Files.fire("download.done", {
                    file: document,
                    blob: blob,
                    url: downloaded.url,
                });
            });

            return Promise.resolve(downloaded);
        }

        if (this.pending.has(id)) {
            return this.pending.get(id)._promise;
        }

        this.internal_downloadStart(document);

        return document._promise = FileAPI.downloadDocument(document, thumb, event => this.internal_downloadNewPart(document, event), options)
            .then(blob => this.internal_downloadDone(document, blob));
    }

    internal_downloadDone(file, blob) {
        file._percentage = 100;

        const downloaded = {
            id: file.id,
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

        return {...downloaded, blob};
    }

    internal_downloadStart(file) {
        file._percentage = 0;

        this.pending.set(file.id, file)

        AppEvents.Files.fire("download.start", {
            file,
        });
    }

    internal_downloadNewPart(file, event) {
        const {newBytes, totalBytes, sizeToBeDownloaded, percentage} = event;

        file._percentage = percentage;
        file._downloadedBytes = totalBytes;

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
        const url = this.getById(fileId).url

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