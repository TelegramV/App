import {MTProto} from "../mtproto";
import Bytes from "../mtproto/utils/bytes"
import Random from "../mtproto/utils/random"
import AppCache from "./cache"

export class FileAPI {
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
            peer: peer.inputPeer,
            pFlags: {
                big: big
            },
            flags: 0
        }
    }

    static saveFilePart(id, bytes) {
        return MTProto.invokeMethod("upload.saveFilePart", {
            file_id: id,
            file_part: 0,
            bytes
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

    static getFileLocation(location, dcID = null) {
        return MTProto.invokeMethod("upload.getFile", {
            location: location,
            flags: 0,
            offset: 0,
            limit: 1024 * 1024
        }, dcID)
    }

    /**
     * @param file
     * @param dcID
     * @param {Peer} peer
     * @param big
     * @return {Promise<string>}
     */
    static getPeerPhoto(file, dcID, peer, big) {
        return new Promise(resolve => {
            return AppCache.get("peerAvatars", file.volume_id + "_" + file.local_id).then(blob => {
                return URL.createObjectURL(blob)
            }).catch(error => {
                return this.getFileLocation(this.getInputPeerPhoto(file, peer, big), dcID).then(response => {
                    const blob = new Blob(new Array(response.bytes), {type: 'application/jpeg'})

                    AppCache.put("peerAvatars", file.volume_id + "_" + file.local_id, blob)

                    return URL.createObjectURL(blob)
                })
            }).then(resolve)
        })
    }

    static getMaxSize(file) {
        return file.sizes[file.sizes.length - 1]
    }

    static photoThumnail(file, resolve) {
        const max = FileAPI.getMaxSize(file)

        try {
            resolve({
                src: FileAPI.getThumbnail(file),
                size: [max.w, max.h],
                thumbnail: true
            })
        } catch {

        } finally {
            FileAPI.getFile(file, max.type).then(file => {
                resolve({
                    src: file,
                    size: [max.w, max.h],
                    thumbnail: false
                })
            })
        }
    }

    static getFile(file, thumb_size = "") {
        return new Promise(resolve => {

            const key = Bytes.asHex(file.file_reference)

            AppCache.get("files", key).then(blob => {
                return URL.createObjectURL(blob)
            }).catch(error => {
                return this.getFileLocation({
                    _: this.getInputName(file),
                    id: file.id,
                    access_hash: file.access_hash,
                    file_reference: file.file_reference,
                    thumb_size: thumb_size
                }, file.dc_id).then(response => {
                    const type = file.mime_type ? file.mime_type : (file._ === "photo" ? 'application/jpeg' : 'octec/stream')
                    const blob = new Blob([response.bytes], {type: type})
                    AppCache.put("files", key, blob)
                    return URL.createObjectURL(blob)
                })
            }).then(resolve)
        })
    }

    static getThumbnail(file) {
        if (!file.sizes || file.sizes[0].type !== "i") throw new Error("There's no thumnail")
        const stripped = file.sizes[0].bytes
        let header = Bytes.fromHex("ffd8ffe000104a46494600010100000100010000ffdb004300281c1e231e19282321232d2b28303c64413c37373c7b585d4964918099968f808c8aa0b4e6c3a0aadaad8a8cc8ffcbdaeef5ffffff9bc1fffffffaffe6fdfff8ffdb0043012b2d2d3c353c76414176f8a58ca5f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8ffc00011080000000003012200021101031101ffc4001f0000010501010101010100000000000000000102030405060708090a0bffc400b5100002010303020403050504040000017d01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9faffc4001f0100030101010101010101010000000000000102030405060708090a0bffc400b51100020102040403040705040400010277000102031104052131061241510761711322328108144291a1b1c109233352f0156272d10a162434e125f11718191a262728292a35363738393a434445464748494a535455565758595a636465666768696a737475767778797a82838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4f5f6f7f8f9faffda000c03010002110311003f00")
        const footer = Bytes.fromHex("ffd9")
        header[164] = stripped[1]
        header[166] = stripped[2]
        return URL.createObjectURL(new Blob([Bytes.concatBuffer(Bytes.concatBuffer(header, stripped.slice(3)), footer)], {type: "application/jpeg"}))
    }
}