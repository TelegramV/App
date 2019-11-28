import {FileAPI} from "../api/fileAPI";
import {createLogger} from "../common/logger";
import {default as PeersManager} from "../api/peers/peersManager";
import {getInputPeerFromPeer} from "../api/dialogs/util";

const Logger = createLogger("Peer")

export class Peer {
    constructor(peer) {
        this._peer = peer
        this._avatar = undefined
    }

    get id() {
        return this.peer.id
    }

    get deleted() {
        return this.peer.pFlags.deleted
    }

    get peer() {
        return this._peer
    }

    get username() {
        return this.peer.username || null
    }

    get verified() {
        return this.peer.pFlags.verified === true
    }

    get peerName() {
        return this.peer.title
    }

    get hasAvatar() {
        return this.peer.photo && this.peer.photo._ !== "chatPhotoEmpty"
    }

    get isMin() {
        return this.peer.pFlags && this.peer.pFlags.min === true
    }

    get inputPeer() {
        return getInputPeerFromPeer(this.type, this.id, this.peer.access_hash)
    }

    get avatarLetter() {
        const split = this.peerName.split(" ")
        return {
            num: Math.abs(this.id) % 8,
            text: split[0].match(/./ug)[0]
        }
    }

    getAvatar(big = false) {
        if(this._avatar)  {
            return Promise.resolve(this._avatar)
        }
        if(!this.hasAvatar) {
            return Promise.resolve(null)
        }
        if(this.isMin) {
            return Promise.resolve(null)
        }

        // TODO cache
        return FileAPI.getPeerPhoto(big ? this.peer.photo.photo_big : this.peer.photo.photo_small, this.peer.photo.dc_id, this, big).then(url => {
            this._avatar = url
            PeersManager.resolveListeners({
                type: "updatePhoto",
                peer: this
            })
            return this._avatar
        }).catch(e => {
            Logger.error("Exception while loading avatar:", e)
        })
    }

    get type() {
        return this.peer._
        //return this.constructor.name.toLowerCase().slice(0, -4)
    }

}