import {MTProto} from "../mtproto";
import {PeerAPI} from "./peerAPI";

export class FileAPI {
    static getInputName(file) {
        switch (file._) {
            case "document":
                return "inputDocumentFileLocation"
            case "photo":
                return "inputPhotoFileLocation"
        }
    }

    static getPhotoMimeType(photo) {
        return "application/jpeg"
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

    static getFileLocation(location) {
        return MTProto.invokeMethod("upload.getFile", {
            location: location,
            flags: 0,
            offset: 0,
            limit: 1024 * 1024
        })
    }

    static getPeerPhoto(file, peer, big) {
        return this.getFileLocation(this.getInputPeerPhoto(file, peer, big))
    }

    static getFile(file, thumb_size = "m") {
        return this.getFileLocation({
            _: this.getInputName(file),
            id: file.id,
            access_hash: file.access_hash,
            file_reference: file.file_reference,
            thumb_size: thumb_size
        })
    }
}
