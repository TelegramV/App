import AppEvents from "../../eventBus/appEvents"
import {FileAPI} from "../../fileAPI"

export class PeerPhoto {
    /**
     * @param {Peer} peer
     * @param rawPhoto
     */
    constructor(peer, rawPhoto) {
        this._peer = peer
        this._rawPhoto = rawPhoto

        this._type = "chatPhotoEmpty"

        this._photoSmall = undefined
        this._photoBig = undefined
        this._dcId = -1

        this._photoSmallUrl = ""
        this._photoBigUrl = ""

        this._letter = {
            num: Math.abs(this._peer.id) % 8,
            text: this._peer.name.split(" ")[0].match(/./ug)[0]
        }

        this._isFetchingSmall = false
        this._isFetchingBig = false

        this.fillRaw(rawPhoto)
    }

    get raw() {
        return this._rawPhoto
    }

    /**
     * @return {string}
     */
    get smallUrl() {
        if (!this.isEmpty) {
            if (this._photoSmallUrl === "" && !this._isFetchingSmall) {
                this.fetchSmall()
                return this._photoSmallUrl
            }

            return this._photoSmallUrl
        } else {
            return ""
        }
    }

    /**
     * @param smallUrl
     */
    set smallUrl(smallUrl) {
        this._photoSmallUrl = smallUrl

        AppEvents.Peers.fire("updatePhotoSmall", {
            peer: this._peer
        })
    }

    /**
     * @return {boolean}
     */
    get isEmpty() {
        return this._type === "chatPhotoEmpty" || this._type === "userProfilePhotoEmpty"
    }

    /**
     * @return {string}
     */
    get bigUrl() {
        if (!this.isEmpty) {
            if (this._photoBigUrl === "" && !this._isFetchingBig) {
                this.fetchBig()
                return this._photoBigUrl
            }

            return this._photoBigUrl
        } else {
            return ""
        }
    }

    /**
     * @param bigUrl
     */
    set bigUrl(bigUrl) {
        this._photoBigUrl = bigUrl

        AppEvents.Peers.fire("updatePhotoBig", {
            peer: this._peer
        })
    }

    /**
     * @return {{num: number, text: string}}
     */
    get letter() {
        return this._letter
    }

    /**
     * @param peer
     * @return {PeerPhoto}
     */
    static createEmpty(peer) {
        return new PeerPhoto(peer, {
            _: peer.type === "user" ? "userProfilePhotoEmpty" : "chatPhotoEmpty"
        })
    }

    /**
     * @param rawPhoto
     */
    fillRaw(rawPhoto) {
        if (rawPhoto && rawPhoto._ !== "chatPhotoEmpty" && rawPhoto._ !== "userProfilePhotoEmpty") {
            this._type = rawPhoto._

            if (!this._photoSmall || this._photoSmall.volume_id !== rawPhoto.photo_small.volume_id || this._photoSmall.local_id !== rawPhoto.photo_small.local_id) {
                this._photoSmall = rawPhoto.photo_small
                this.fetchSmall()
            }

            this._photoBig = rawPhoto.photo_big
            this._dcId = rawPhoto.dc_id


        } else {
            this._type = this._peer.type === "user" ? "userProfilePhotoEmpty" : "chatPhotoEmpty"
        }

        this._letter = {
            num: Math.abs(this._peer.id) % 8,
            text: this._peer.name.split(" ")[0].match(/./ug)[0]
        }
    }

    /**
     * @return {Promise<string>}
     */
    fetchSmall() {
        this._isFetchingSmall = true

        return FileAPI.getPeerPhoto(this._photoSmall, this._dcId, this._peer, false).then(url => {
            this._isFetchingSmall = false

            this.smallUrl = url
        })
    }

    /**
     * @return {Promise<string>}
     */
    fetchBig() {
        this._isFetchingBig = true

        return FileAPI.getPeerPhoto(this._photoBig, this._dcId, this._peer, true).then(url => {
            this._isFetchingBig = false

            this.bigUrl = url
        })
    }
}