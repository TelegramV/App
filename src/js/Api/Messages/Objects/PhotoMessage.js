// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import FileManager from "../../Files/FileManager"

export class PhotoMessage extends AbstractMessage {

    type = MessageType.PHOTO

    get srcUrl() {
        return FileManager.getUrl(this.media)
    }

    get media() {
        return this.raw.media.photo
    }
}