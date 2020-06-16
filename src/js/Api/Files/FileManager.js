import {FileAPI} from "./FileAPI"
import AppEvents from "../EventBus/AppEvents"

class FilesManager {

    pending = new Map()
    downloaded: Map<string, { url?: string; }> = new Map()

    isPending(file, thumbOrSize) {
        return this.pending.has(this.id(file, thumbOrSize))
    }

    isDownloaded(file, thumbOrSize) {
        return this.downloaded.has(this.id(file, thumbOrSize))
    }

    getPercentage(file, thumbOrSize) {
        return this.pending.get(this.id(file, thumbOrSize))?._percentage ?? 100
    }

    getPendingSize(file, thumbOrSize) {
        return this.pending.get(this.id(file, thumbOrSize))?._downloadedBytes?.length ?? 0
    }

    getPending(file, thumbOrSize) {
        return this.pending.get(this.id(file, thumbOrSize))
    }

    get(file, thumbOrSize) {
        return this.downloaded.get(this.id(file, thumbOrSize))
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
        const id = this.id(file, thumbOrSize)
        this.pending.delete(id)

        AppEvents.Files.fire("download.canceled", {
            file: file,
            id,
        })
    }

    checkCache(file, thumbOrSize): Promise<Blob> | any {
        const id = this.id(file, thumbOrSize);

        if (this.downloaded.has(id)) {
            const downloaded = this.get(file, thumbOrSize);

            fetch(downloaded.url).then(r => r.blob()).then(blob => {
                AppEvents.Files.fire("download.done", {
                    id,
                    file,
                    blob: blob,
                    url: downloaded.url,
                });
            });

            return Promise.resolve(downloaded);
        }

        return FileAPI.tryFromCache(file, thumbOrSize).then(blob => this.internal_downloadDone(file, thumbOrSize, blob)).catch(error => {
            // console.error(error)
        })
    }

    downloadPhoto(photo, size, options): Promise<Blob> | any {
        const id = this.id(photo, size);

        if (this.downloaded.has(id)) {
            const downloaded = this.downloaded.get(id);

            fetch(downloaded.url).then(r => r.blob()).then(blob => {
                AppEvents.Files.fire("download.done", {
                    file: photo,
                    blob: blob,
                    url: downloaded.url,
                    id,
                });
            });

            return Promise.resolve(downloaded);
        }

        if (this.pending.has(id)) {
            return this.pending.get(id)._promise;
        }

        this.internal_downloadStart(photo, size);

        return photo._promise = FileAPI.downloadPhoto(photo, size, event => this.internal_downloadNewPart(photo, size, event), options)
            .then(blob => this.internal_downloadDone(photo, size, blob));
    }

    downloadDocument(document, thumb, options): Promise<Blob> | any {
        const id = this.id(document, thumb);

        if (this.downloaded.has(id)) {
            const downloaded = this.downloaded.get(id);

            fetch(downloaded.url).then(r => r.blob()).then(blob => {
                AppEvents.Files.fire("download.done", {
                    file: document,
                    blob: blob,
                    url: downloaded.url,
                    id,
                });
            });

            return Promise.resolve(downloaded);
        }

        if (this.pending.has(id)) {
            return this.pending.get(id)._promise;
        }

        this.internal_downloadStart(document, thumb);

        return document._promise = FileAPI.downloadDocument(document, thumb, event => this.internal_downloadNewPart(document, thumb, event), options)
            .then(blob => this.internal_downloadDone(document, thumb, blob));
    }

    downloadVideo(document, options = {}): Promise<Blob> | any {
        // if (!DocumentParser.isVideoStreamable(document)) {
        return this.downloadDocument(document, null, options);
        // }

        // options.limit = options.limit ?? 1024 * 1024;
        //
        // const id = this.id(document);
        //
        // if (this.downloaded.has(id)) {
        //     const downloaded = this.downloaded.get(id);
        //
        //     fetch(downloaded.url).then(r => r.blob()).then(blob => {
        //         AppEvents.Files.fire("download.done", {
        //             file: document,
        //             blob: blob,
        //             url: downloaded.url,
        //             id,
        //         });
        //     });
        //
        //     return Promise.resolve(downloaded);
        // }
        //
        // if (this.pending.has(id)) {
        //     return this.pending.get(id)._promise;
        // }
        //
        // document.__mp4file = new MP4StreamingFile(document);
        //
        // this.internal_downloadStart(document);
        //
        // return document._promise = document.__mp4file.init()
        //     .then(() => FileAPI.downloadDocument(document, null, event => this.internal_downloadNewPart(document, null, event), options).then(blob => this.internal_downloadDone(document, null, blob)));
    }

    id(file, thumb, options) {
        return thumb ? `${file.id}_${thumb.id}` : file.id;
    }

    internal_downloadDone(file, thumbOrSize, blob) {
        const id = this.id(file, thumbOrSize)

        file._percentage = 100;

        const downloaded = {
            id,
            url: URL.createObjectURL(blob),
        };

        this.pending.delete(id);
        this.downloaded.set(id, downloaded);

        if (file.__mp4file) {
            file.__mp4file = null;
        }

        AppEvents.Files.fire("download.done", {
            file: file,
            blob,
            url: downloaded.url,
            id,
        });

        file._promise = Promise.resolve(downloaded);

        return {...downloaded, blob};
    }

    internal_downloadStart(file, thumbOrSize) {
        const id = this.id(file, thumbOrSize)

        file._percentage = 0;

        this.pending.set(id, file)

        AppEvents.Files.fire("download.start", {
            file,
            id,
        });
    }

    internal_downloadNewPart(file, thumbOrSize, event) {
        const id = this.id(file, thumbOrSize)

        const {newBytes, totalBytes, sizeToBeDownloaded, percentage} = event;

        file._percentage = percentage;
        file._downloadedBytes = totalBytes;

        AppEvents.Files.fire("download.newPart", {
            id,
            file,
            newBytes,
            totalBytes,
            sizeToBeDownloaded,
            percentage
        });

        return !!this.pending.get(id); // cancel then
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

    checkEvent(event, file, thumbOrSize = null) {
        return event.id === this.id(file, thumbOrSize)
    }
}

const FileManager = new FilesManager()

export default FileManager