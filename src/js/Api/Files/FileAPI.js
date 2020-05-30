import MTProto from "../../MTProto/External";
import Random from "../../MTProto/Utils/Random"
import AppCache from "../Cache/AppCache"
import {getInputPeerFromPeer} from "../Dialogs/util"
import {Peer} from "../Peers/Objects/Peer";
import AppConfiguration from "../../Config/AppConfiguration";
import {bytesAsHex, bytesConcat, bytesConcatBuffer, bytesFromHex} from "../../Utils/byte"
import API from "../Telegram/API"
import StickerSet from "../Stickers/StickerSet"

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
     *
     * @param document
     * @param thumb
     * @param onPartDownloaded
     * @param useCache
     */
    static downloadDocument(document, thumb, onPartDownloaded, useCache = true): Promise<Blob> {
        if (document._ === "documentEmpty") {
            return Promise.reject("documentEmpty");
        }

        const location = {
            _: "inputDocumentFileLocation",
            id: document.id,
            access_hash: document.access_hash,
            file_reference: document.file_reference,
            thumb_size: thumb ? thumb.type : "",
        };

        const size = thumb ? thumb.size : document.size;

        return FileAPI.downloadAllParts(location, size, document.dc_id, onPartDownloaded)
            .then(file => FileAPI.getBlob(file, document.mime_type));
    }

    /**
     * @see https://core.telegram.org/type/Photo
     *
     * @param photo
     * @param size
     */
    static downloadPhoto(photo, size): Promise<Blob> {
        if (photo._ === "photoEmpty") {
            return Promise.reject("photoEmpty");
        }

        if (!size) {
            size = photo.sizes[photo.sizes.length - 1]
        }

        const location = {
            _: "inputPhotoFileLocation",
            id: photo.id,
            access_hash: photo.access_hash,
            file_reference: photo.file_reference,
            thumb_size: size.type,
        };

        return FileAPI.downloadAllParts(location, size.size, photo.dc_id)
            .then(file => FileAPI.getBlob(file, "application/jpeg"));
    }

    /**
     * @param location
     * @param size
     * @param dcId
     * @param onPartDownloaded
     * @returns {Promise<{bytes: Uint8Array}>}
     */
    static async downloadAllParts(location, size, dcId, onPartDownloaded) {
        let bytes = new Uint8Array();
        let file = {};

        while (bytes.length < size) {
            file = await API.upload.getFile({
                location: location,
                offset: bytes.length,
            }, dcId);

            bytes = bytesConcat(bytes, file.bytes);

            if (onPartDownloaded) {
                if (onPartDownloaded(file.bytes, bytes) === false) {
                    break; // interrupted
                }
            }
        }

        file.bytes = bytes;

        return file;
    }

    static async decodeAnimatedSticker(bytes) {
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

    static getUrl(file, type): Blob {
        if (file instanceof Blob) {
            return URL.createObjectURL(file);
        }

        return URL.createObjectURL(FileAPI.getBlob(file, type));
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

    static async uploadDocument(bytes, name = "") {
        return {
            _: "inputMediaUploadedDocument",
            file: await this.uploadFile(bytes, name),
            attributes: [
                {
                    _: "documentAttributeFilename",
                    file_name: name
                }
            ]
        }
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
        const id = await MTProto.TimeManager.generateMessageId(AppConfiguration.mtproto.dataCenter.default)
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

    static uploadProfilePhoto(name, bytes) {
        const id = [Random.nextInteger(0xffffffff), Random.nextInteger(0xffffffff)]

        return this.saveFilePart(id, bytes).then(MTProto.invokeMethod("photos.uploadProfilePhoto", {
            file: {
                _: "inputFile",
                id,
                parts: 1,
                name: name
            }
        }))
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
                const blob = new Blob(new Array(response.bytes), {type: 'application/jpeg'})

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

    static getMaxSize(file, onlyThumb = false) {
        if (!onlyThumb) {
            const video = FileAPI.getAttribute(file, "documentAttributeVideo")
            if (video) {
                return video
            }
        }

        return (file.sizes || file.thumbs).filter(l => l.type !== "i").reduce(function (prev, current) {
            return (prev.w > current.w) ? prev : current
        })
    }

    static getMinSize(file, onlyThumb = false) {
        if (!onlyThumb) {
            const video = this.getAttribute(file, "documentAttributeVideo")
            if (video) {
                return video
            }
        }

        return (file.sizes || file.thumbs).filter(l => l.type !== "i").reduce(function (prev, current) {
            return (prev.w < current.w) ? prev : current
        })
    }

    static getThumbSize(file) {
        if (!file.thumbs) return undefined;
        for (const thumb of file.thumbs) {
            if (thumb._ !== "photoSize") continue;
            return {
                w: thumb.w,
                h: thumb.h
            }
        }

        return undefined;
    }

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

            return this.createBlobFromParts(file, "application/jpeg", await this.getAllParts(file, size, thumb_size, onProgress))
        })
    }

    static getPhoto(file, thumb_size = "", onProgress = undefined) {
        return this.tryCache(file).catch(async _ => {
            if (!file.sizes) throw new Error("No sizes specified for file", file)

            thumb_size = this.parseThumbSize(file, thumb_size)
            const size = file.sizes.find(l => l.type === thumb_size).size
            return this.createBlobFromParts(file, "application/jpeg", await this.getAllParts(file, size, thumb_size, onProgress))
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
        if ((file.sizes && file.sizes[0].type === "i") || (file.thumbs && file.thumbs[0].type === "i")) {
            const stripped = (file.sizes || file.thumbs)[0].bytes
            let header = FileAPI.thumbHeader
            const footer = bytesFromHex("ffd9")
            header[164] = stripped[1]
            header[166] = stripped[2]
            return URL.createObjectURL(new Blob([bytesConcatBuffer(bytesConcatBuffer(header, stripped.slice(3)), footer)], {type: "application/jpeg"}))
        }
    }
}