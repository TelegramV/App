import AppEvents from "../../EventBus/AppEvents"
import {FileAPI} from "../../Files/FileAPI"

export class PeerPhoto {
    /**
     * @param {Peer} peer
     * @param rawPhoto
     */
    constructor(peer, rawPhoto) {
        this._peer = peer
        this._photo = peer?._full?.photo

        this._type = "chatPhotoEmpty"

        this._photoSmall = undefined
        //this._photoBig = undefined
        this._dcId = -1

        this._photoSmallUrl = ""
        this._photoBigUrl = ""
        this._videoUrl = ""

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

    get peer() {
        return this._peer
    }

    get hasVideo() {
        return this.rawPhoto.has_video
    }

    /**
     * @return {string}
     */
    get smallUrl() {
        if (!this.isEmpty) {
            if (this._photoSmallUrl === "" && !this._isFetchingSmall) {
                this.fetchSmall()
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

        this._peer.fire("updatePhotoSmall")
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

        this._peer.fire("updatePhotoBig")
    }

    /**
     * @return {string}
     */
    get videoUrl() {
        if (!this.isEmpty) {
            // uncomenting lines below causes really bad consequences
            /*//if (this._videoUrl === "" && !this._isFetchingVideo) {
              //  this.fetchVideo()
              //  return this._videoUrl
            }*/
            let startTime = 0;
            if(this._photo?.video_sizes) startTime = this._photo.video_sizes[0].video_start_ts
            let url = startTime ? (this._videoUrl + "#t=" + startTime) : this._videoUrl
            return url;
        } else {
            return ""
        }
    }

    /**
     * @param videoUrl
     */
    set videoUrl(videoUrl) {
        this._videoUrl = videoUrl
        this._peer.fire("updateProfileVideo")
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
        this.rawPhoto = rawPhoto;
        if (rawPhoto && rawPhoto._ !== "chatPhotoEmpty" && rawPhoto._ !== "userProfilePhotoEmpty") {
            this._type = rawPhoto._

            this._dcId = rawPhoto.dc_id

            if (!this._photoSmall || this._photoSmall.volume_id !== rawPhoto.photo_small.volume_id || this._photoSmall.local_id !== rawPhoto.photo_small.local_id) {
                this._photoSmall = rawPhoto.photo_small
                this._photoSmallUrl = ""; // reset photo
                // Fetch avatar only when you need to show it!
                // this.fetchSmall()
            }
        } else {
            this._type = this._peer.type === "user" ? "userProfilePhotoEmpty" : "chatPhotoEmpty"
        }

        this._letter = {
            num: Math.abs(this._peer.id) % 8,
            text: this._peer.name.split(" ")[0].match(/./ug)[0]
        }
    }

    fillFull(photo) {
        this._photo = photo;
    }

    /**
     * @return {Promise<string>}
     */
    fetchSmall() {
        if(this._photoSmallUrl) return this._photoSmallUrl
        this._isFetchingSmall = true

        if (!this._photoSmall) {
            return Promise.reject("no small photo found")
        }

        return FileAPI.getPeerPhoto(this._photoSmall, this._dcId, this._peer, false).then(url => {
            this._isFetchingSmall = false
            
            return this.smallUrl = url
        })
    }

    /**
     * Fetching big from full user
     * @return {Promise<string>}
     */
    async fetchBig() {
        if(this._photoBigUrl) return this._photoBigUrl;
        this._isFetchingBig = true

        if(!this._photo) {
            await this._peer.fetchFull();
        }

        return FileAPI.downloadPhoto(this._photo, FileAPI.getMaxSize(this._photo), null, {type: "image/png"}).then(blob => {
            this._isFetchingBig = false

            return this.bigUrl = URL.createObjectURL(blob);
        })
    }

    async fetchVideo() {
        if(this.videoUrl) return this.videoUrl;
        this._isFetchingVideo = true;

        if(!this._photo) {
            await this._peer.fetchFull();
        }

        if(!this._photo?.video_sizes) return null;

        return FileAPI.downloadPhoto(this._photo, FileAPI.getMaxSize(this._photo, false), null, {"type": "video/mp4"}).then(blob => {
            this._isFetchingVideo = false;

            return this.videoUrl = URL.createObjectURL(blob);
        })

    }
}