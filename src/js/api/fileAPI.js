import {MTProto} from "../mtproto";
import {PeerAPI} from "./peerAPI";
import {bytesToHex} from "../mtproto/utils/bin";

const cache = {}
const cachePeerPhotos = {}

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
            peer: PeerAPI.getInput(peer),
            pFlags: {
                big: big
            },
            flags: 0
        }
    }

    static getFileLocation(location, dcID = null) {
        return MTProto.invokeMethod("upload.getFile", {
            location: location,
            flags: 0,
            offset: 0,
            limit: 1024 * 1024
        }, dcID)
    }

    static getPeerPhoto(file, dcID, peer, big) {
        return new Promise(resolve => {
            if (cachePeerPhotos[file.volume_id + "_" + file.local_id]){
                resolve(cachePeerPhotos[file.volume_id + "_" + file.local_id])
                return
            }
            return this.getFileLocation(this.getInputPeerPhoto(file, peer, big), dcID).then(response => {
                const blob = new Blob([response.bytes], {type: 'application/jpeg'});
                return cachePeerPhotos[file.volume_id + "_" + file.local_id] = URL.createObjectURL(blob)
            }).then(resolve)
        })
    }

    static getFile(file, thumb_size = "") {
        return new Promise(resolve => {
            const key = bytesToHex(file.file_reference)
            if (cache[key]){
                resolve(cache[key])
                return
            }

            return this.getFileLocation({
                _: this.getInputName(file),
                id: file.id,
                access_hash: file.access_hash,
                file_reference: file.file_reference,
                thumb_size: thumb_size
            }, file.dc_id).then(response => {
                const type = file.mime_type ? file.mime_type : (file._ === "photo" ? 'application/jpeg' : 'octec/stream')
                const blob = new Blob([response.bytes], {type: type});
                return cache[key] = URL.createObjectURL(blob)
            }).then(resolve)
        })
    }
}
