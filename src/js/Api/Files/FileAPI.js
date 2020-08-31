import MTProto from "../../MTProto/External";
import AppCache from "../Cache/AppCache"
import {bytesAsHex, bytesConcat, bytesConcatBuffer, bytesFromHex} from "../../Utils/byte"
import API from "../Telegram/API"
import StickerSet from "../Stickers/StickerSet"
import {getInputPeerFromPeer} from "../Dialogs/util"
import Random from "../../MTProto/Utils/Random"

class DownloadCanceledException {
}

const DEFAULT_PART_SIZE = 256 * 256

export class FileAPI {
    static thumbHeader = bytesFromHex("ffd8ffe000104a46494600010100000100010000ffdb004300281c1e231e19282321232d2b28303c64413c37373c7b585d4964918099968f808c8aa0b4e6c3a0aadaad8a8cc8ffcbdaeef5ffffff9bc1fffffffaffe6fdfff8ffdb0043012b2d2d3c353c76414176f8a58ca5f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8ffc00011080000000003012200021101031101ffc4001f0000010501010101010100000000000000000102030405060708090a0bffc400b5100002010303020403050504040000017d01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9faffc4001f0100030101010101010101010000000000000102030405060708090a0bffc400b51100020102040403040705040400010277000102031104052131061241510761711322328108144291a1b1c109233352f0156272d10a162434e125f11718191a262728292a35363738393a434445464748494a535455565758595a636465666768696a737475767778797a82838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4f5f6f7f8f9faffda000c03010002110311003f00")

    static downloadStickerSetThumb(stickerSet: StickerSet): Promise<Blob> {
        const thumb = stickerSet.raw.thumb;

        if (!thumb) {
            return FileAPI.downloadDocument(stickerSet.rawStickerSet.documents[0]);
        }

        if (thumb._ === "photoSize") {
            return API.upload.getFile({
                location: {
                    _: "inputStickerSetThumb",
                    stickerset: stickerSet.input,
                    volume_id: thumb.location.volume_id,
                    local_id: thumb.location.local_id,
                },
            }, stickerSet.thumb_dc_id).then(file => FileAPI.getBlob(file, document.mime_type));
        } else if (thumb._ === "photoCachedSize" || thumb._ === "photoStrippedSize") {
            console.log("todo gg")
            return Promise.resolve(null);
        } else {
            console.log("todo kk")
            return Promise.resolve(null);
        }
    }

    /**
     * @see https://core.telegram.org/type/Document
     */
    static downloadDocument(document, thumb, onPartDownloaded, options): Promise<Blob> {
        if (document._ === "documentEmpty") {
            return Promise.reject("documentEmpty");
        }

        const location = FileAPI.makeDocumentLocation(document, thumb);

        const size = thumb ? thumb.size : document.size;
        const limit = options?.limit ?? DEFAULT_PART_SIZE;

        return FileAPI.downloadAllParts(location, size, limit, document.dc_id, onPartDownloaded)
            .then(file => FileAPI.getBlob(file, options?.type || document.mime_type))
            .then(blob => FileAPI.putToCache(document, blob));
    }

    /**
     * @see https://core.telegram.org/type/Photo
     */
    static downloadPhoto(photo, size, onPartDownloaded, options): Promise<Blob> {
        if (photo._ === "photoEmpty") {
            return Promise.reject("photoEmpty");
        }

        return FileAPI.tryFromCache(photo).catch(() => {
            if (!size) {
                size = this.getMaxSize(photo) /*|| (photo.video_sizes && photo.video_sizes[photo.video_sizes.length - 1])*/
            }

            const location = this.makePhotoLocation(photo, size);
            const limit = options?.limit ?? DEFAULT_PART_SIZE;

            return FileAPI.downloadAllParts(location, size.size, limit, photo.dc_id, onPartDownloaded)
                .then(file => FileAPI.getBlob(file, options?.type || "image/jpeg"))
                .then(blob => FileAPI.putToCache(photo, blob, size))
        })
    }

    static async downloadAllParts(location, totalSize, limit, dcId, onPartDownloaded): Promise<{ bytes: Uint8Array }> {
        let bytes = new Uint8Array();
        let file = {};

        limit = limit ?? DEFAULT_PART_SIZE;

        while (bytes.length < totalSize) {
            file = await FileAPI.downloadPart({
                location: location,
                offset: bytes.length,
                limit,
            }, dcId);

            bytes = bytesConcat(bytes, file.bytes);

            if (bytes.length !== totalSize && onPartDownloaded) {
                if (onPartDownloaded({
                    newBytes: file.bytes,
                    totalBytes: bytes,
                    sizeToBeDownloaded: totalSize,
                    percentage: bytes.length / totalSize * 100,
                }) === false) {
                    throw new DownloadCanceledException()
                }
            }
        }

        file.bytes = bytes;

        return file;
    }

    static downloadDocumentPart(document, thumb, limit, offset): Promise<{ bytes: Uint8Array }> {
        if (document._ === "documentEmpty") {
            return Promise.reject("documentEmpty");
        }

        const location = FileAPI.makeDocumentLocation(document, thumb);

        return FileAPI.downloadPart({location, limit, offset}, document.dc_id);
    }

    static downloadPhotoPart(photo, size, limit, offset): Promise<{ bytes: Uint8Array }> {
        if (photo._ === "photoEmpty") {
            return Promise.reject("photoEmpty");
        }

        const location = FileAPI.makePhotoLocation(photo, size);

        return FileAPI.downloadPart({location, limit, offset}, photo.dc_id);
    }

    static downloadPart({location, limit, offset}, dcId): Promise<{ bytes: Uint8Array }> {
        return API.upload.getFile({
            location,
            limit,
            offset,
        }, dcId);
    }

    static makePhotoLocation(photo, size) {
        if (!size) {
            size = photo.sizes[photo.sizes.length - 1]; // maybe try video first... or not?
        }

        return {
            _: "inputPhotoFileLocation",
            id: photo.id,
            access_hash: photo.access_hash,
            file_reference: photo.file_reference,
            thumb_size: size.type,
        };
    }

    static makeDocumentLocation(document, thumb) {
        return {
            _: "inputDocumentFileLocation",
            id: document.id,
            access_hash: document.access_hash,
            file_reference: document.file_reference,
            thumb_size: thumb ? thumb.type : "",
        };
    }

    static async decodeAnimatedSticker(bytes): Promise<Object> {
        if (bytes instanceof Blob) {
            bytes = await bytes.arrayBuffer();
        }

        if (!(bytes instanceof Uint8Array)) {
            bytes = new Uint8Array(bytes);
        }

        if (bytes[0] == 123) { //"{"
            return JSON.parse(new TextDecoder("utf-8").decode(bytes));
        } else {
            return MTProto.performWorkerTask("gzipUncompress", bytes).then(bytes => {
                return JSON.parse(new TextDecoder("utf-8").decode(bytes));
            });
        }
    }

    static getBlob(file, type): Blob {
        return new Blob([file.bytes], {type: type});
    }

    static getBytesFromBlob(blob: Blob): Uint8Array {
        return blob.arrayBuffer().then(buffer => new Uint8Array(buffer));
    }

    static getUrl(file, type): string {
        if (file instanceof Blob) {
            return URL.createObjectURL(file);
        }

        return URL.createObjectURL(FileAPI.getBlob(file, type));
    }

    static tryFromCache(file, thumbOrSize): Promise<Blob> {
        let sectorName = "files";

        if (file._ === "photo") {
            sectorName = "images"
        }

        return AppCache.get(sectorName, `${file.id}${thumbOrSize ? "_" + thumbOrSize.type : ""}`).then(blob => {
            if (blob) {
                return blob
            }

            throw "no file in cache";
        });
    }

    static putToCache(file, blob: Blob, thumbOrSize): Promise<Blob> {
        if (blob.size > 10485760) { // do not cache larger than 10MB
            return Promise.resolve(blob);
        }

        let sectorName = "files";

        if (file._ === "photo") {
            sectorName = "images"
        }

        return AppCache.put(sectorName, `${file.id}${thumbOrSize ? "_" + thumbOrSize.type : ""}`, blob)
            .then(() => blob)
            .catch(() => blob)
    }

    // OUTDATED BELOW

    static getInputName(file) {
        switch (file._) {
            case "document":
                return "inputDocumentFileLocation"
            case "photo":
                return "inputPhotoFileLocation"
        }
    }

    static getInputPeerPhoto(file, peer, big = false) {
        return {
            _: "inputPeerPhotoFileLocation",
            volume_id: file.volume_id,
            local_id: file.local_id,
            peer: getInputPeerFromPeer(peer.type, peer.id, peer.accessHash),
            big: big
        }
    }

    static uploadMediaToPeer(peer: Peer, media) {
        return MTProto.invokeMethod("messages.uploadMedia", {
            peer: peer.inputPeer,
            media: media
        })
    }

    static async uploadDocument(bytes, name = "", params={}) {
        let media = {
            _: "inputMediaUploadedDocument",
            file: await this.uploadFile(bytes, name),
            mime_type: "application/octet-stream",
            attributes: []
        }
        media = {...media, ...params}
        if(!media.attributes.find(attr => attr._==="documentAttributeFilename")) { //append name if not set
            media.attributes.push({
                    _: "documentAttributeFilename",
                    file_name: name
                })
        }
        return media
    }

    static async uploadPhoto(bytes, name = "") {
        return {
            _: "inputMediaUploadedPhoto",
            file: await this.uploadFile(bytes, name)
        }
    }

    static async uploadFile(bytes: ArrayBuffer, name = "") {
        const size = bytes.byteLength
        const splitSize = 1024 * 256
        const bigFileLimit = 1024 * 1024 * 10
        const parts = Math.ceil(size / splitSize)
        const isBig = size >= bigFileLimit
        const id = await MTProto.TimeManager.generateMessageId()
        const inputFile = {
            _: isBig ? "inputFileBig" : "inputFile",
            parts: parts,
            name: name,
            id: id
        }

        const b = new Uint8Array(bytes)

        let offset = 0
        let i = 0
        while (offset !== size) {
            let end = Math.min(size, offset + splitSize)
            let splitted = b.buffer.slice(offset, end)
            const response = await MTProto.invokeMethod(isBig ? "upload.saveBigFilePart" : "upload.saveFilePart", {
                file_id: id,
                file_part: i,
                file_total_parts: parts,
                bytes: splitted
            })
            offset = end
            i++
        }
        return inputFile
    }

    static saveFilePart(id, bytes) {
        return MTProto.invokeMethod("upload.saveFilePart", {
            file_id: id,
            file_part: 0,
            bytes
        }).then(_ => {
            return id
        })
    }

    static obsolete_getFileLocation(location, dcID = null, offset = 0) {
        return MTProto.invokeMethod("upload.getFile", {
            location: location,
            offset: offset,
            limit: 1024 * 1024
        }, dcID)
    }

    static getWebFile(webFileLocation) {
        return this.getWebFileLocation(webFileLocation).then(file => {
            return new Promise(async (resolve, reject) => {
                const blob = new Blob(new Array(file.bytes), {type: file.mime_type});
                resolve(URL.createObjectURL(blob))
                //TODO cache
            })
        })
    }

    static getWebFileLocation(webFileLocation, dcID = 4, offset = 0) {
        return MTProto.invokeMethod("upload.getWebFile", {
            location: webFileLocation,
            offset: offset,
            limit: 1024 * 1024
        }, dcID)
    }

    static prepareWebFileLocation(geoPoint, w = 512, h = 512, zoom = 20, scale = 1) {
        let geo = {
            _: "inputGeoPoint",
            lat: geoPoint.lat,
            long: geoPoint.long
        }
        return {
            _: "inputWebFileGeoPointLocation",
            geo_point: geo,
            access_hash: geoPoint.access_hash,
            w: w,
            h: h,
            zoom: zoom,
            scale: scale
        }
    }

    /**
     * @param file
     * @param dcID
     * @param {Peer} peer
     * @param big
     * @return {Promise<string>}
     */
    static getPeerPhoto(file, dcID, peer, big) {
        return AppCache.get("peerAvatars", file.volume_id + "_" + file.local_id).then(blob => {
            return URL.createObjectURL(blob)
        }).catch(error => {
            return this.obsolete_getFileLocation(this.getInputPeerPhoto(file, peer, big), dcID).then(response => {
                if (!response) {
                    return ""
                }
                const blob = new Blob(new Array(response.bytes), {type: 'image/jpeg'})

                AppCache.put("peerAvatars", file.volume_id + "_" + file.local_id, blob).catch(error => {
                    //
                })

                return URL.createObjectURL(blob)
            })
        })
    }

    static hasThumbnail(file) {
        return (file.sizes || file.thumbs) && (file.sizes || file.thumbs).some(l => l.type === "i")
    }

    static getMaxSize(file, onlyThumb = true) {
        if (!onlyThumb) {
            const video = FileAPI.getAttribute(file, "documentAttributeVideo")
            if (video) {
                return video
            }
            if(file.video_sizes) {
                return file.video_sizes.reduce(function (prev, current) {
                    return (prev.w > current.w) ? prev : current
                })
            }
        }

        return (file.sizes || file.thumbs).filter(el => el._ === "photoSize").reduce(function (prev, current) {
            return (prev.w > current.w) ? prev : current
        })
    }

    static getMinSize(file, onlyThumb = false) {
        if (!onlyThumb) {
            const video = this.getAttribute(file, "documentAttributeVideo")
            if (video) {
                return video
            }

            if(file.video_sizes) {
                return file.video_sizes.reduce(function (prev, current) {
                    return (prev.w < current.w) ? prev : current
                })
            }
        }

        return (file.sizes || file.thumbs).reduce(function (prev, current) {
            return (prev.w < current.w) ? prev : current
        })
    }

    // static getThumbSize(file) {
    //     if (!file.thumbs) return undefined;
    //     for (const thumb of file.thumbs) {
    //         if (thumb._ !== "photoSize") continue;
    //         return {
    //             w: thumb.w,
    //             h: thumb.h
    //         }
    //     }
    //
    //     return undefined;
    // }

    static getAttribute(file, attribute) {
        return file.attributes && file.attributes.find(l => l._ === attribute)
    }

    static async photoThumbnail(file) {
        const max = FileAPI.getMaxSize(file)

        try {
            return {
                src: FileAPI.getThumbnail(file),
                size: [max.w, max.h],
                thumbnail: true
            };
        } catch {

        } finally {
            return FileAPI.getFile(file, max.type).then(file => {
                return {
                    src: file,
                    size: [max.w, max.h],
                    thumbnail: false
                };
            })
        }
    }

    static tryCache(file) {
        return AppCache.get("files", bytesAsHex(file.file_reference)).then(blob => {
            return URL.createObjectURL(blob)
        })
    }

    static putCache(file, blob) {
        AppCache.put("files", bytesAsHex(file.file_reference), blob).catch(error => {
            //
        })
    }

    // TODO check this!
    // @deprecated use FileManager instead
    static getAllParts(file, size, thumb_size, onProgress = undefined) {
        return new Promise(async (resolve, reject) => {
            let offset = 0
            const parts = []

            while (offset < size) {
                if (onProgress && !onProgress(offset, size)) {
                    reject("Cancelled by user")
                    return
                }
                let response = await this.obsolete_getFileLocation({
                    _: this.getInputName(file),
                    id: file.id,
                    access_hash: file.access_hash,
                    file_reference: file.file_reference,
                    thumb_size: thumb_size
                }, file.dc_id, offset)

                if (!response.bytes) {
                    console.error("Fatal error while loading part", response, file, offset, size)
                }

                offset += response.bytes.length
                parts.push(response.bytes)
            }

            if (onProgress && !onProgress(offset, size)) {
                reject("Cancelled by user [file downloaded tho]")
                return
            }
            resolve(parts)
        })
    }

    static createBlobFromParts(file, mime, parts, useCache = true) {
        const blob = new Blob(parts, {type: mime})

        if (useCache) {
            this.putCache(file, blob)
        }

        return URL.createObjectURL(blob)
    }

    static parseThumbSize(file, thumb_size) {
        if (thumb_size === "max") {
            return FileAPI.getMaxSize(file).type
        }
        if (thumb_size === "min") {
            return FileAPI.getMinSize(file).type
        }
        return thumb_size
    }

    static getThumb(file, thumb_size = "", onProgress = undefined) {
        return this.tryCache(file).catch(async _ => {
            if (!file.thumbs) throw new Error("No thumbs specified for file", file)

            thumb_size = this.parseThumbSize(file, thumb_size)
            const size = file.thumbs.find(l => l.type === thumb_size).size

            return this.createBlobFromParts(file, "image/jpeg", await this.getAllParts(file, size, thumb_size, onProgress))
        })
    }

    static getPhoto(file, thumb_size = "", onProgress = undefined) {
        return this.tryCache(file).catch(async _ => {
            if (!file.sizes && !file.video_sizes) throw new Error("No sizes specified for file", file)

            thumb_size = this.parseThumbSize(file, thumb_size)
            const size = file.sizes.find(l => l.type === thumb_size).size
            return this.createBlobFromParts(file, thumb_size.type==="u" ? "video/mp4" : "image/jpeg", await this.getAllParts(file, size, thumb_size, onProgress))
        })
    }

    static getFull(file, onProgress = undefined) {
        return this.tryCache(file).catch(async _ => {
            if (!file.size) throw new Error("No size specified for file", file)

            const size = file.size
            return this.createBlobFromParts(file, file.mime_type, await this.getAllParts(file, size, "", onProgress))
        })
    }

    /**
     * @deprecated
     * @param file
     * @param thumb_size
     * @param onProgress
     */
    static getFile(file, thumb_size = "", onProgress) {
        if (thumb_size === "") {
            return this.getFull(file, onProgress)
        } else if (file._ === "photo") {
            return this.getPhoto(file, thumb_size, onProgress)
        } else {
            return this.getThumb(file, thumb_size, onProgress)
        }
    }

    static getThumbnail(file) {
        if ((file.sizes && file.sizes[0].bytes) || (file.thumbs && file.thumbs[0].bytes)) {
            const stripped = (file.sizes || file.thumbs)[0].bytes
            let header = FileAPI.thumbHeader
            const footer = bytesFromHex("ffd9")
            header[164] = stripped[1]
            header[166] = stripped[2]
            return URL.createObjectURL(new Blob([bytesConcatBuffer(bytesConcatBuffer(header, stripped.slice(3)), footer)], {type: "image/jpeg"}))
        }
    }

    static getAnimatedStickerThumbnail(file) {
        if ((file.sizes && file.sizes[0].bytes) || (file.thumbs && file.thumbs[0].bytes)) {
            const stripped = (file.sizes || file.thumbs)[0].bytes
            return URL.createObjectURL(new Blob([stripped]))
        }
    }
}