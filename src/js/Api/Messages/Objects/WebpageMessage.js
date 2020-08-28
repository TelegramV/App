import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class WebpageMessage extends AbstractMessage {

    type = MessageType.WEB_PAGE

    fillWebPage(webpage) {
    	this.raw.media.webpage = webpage

    	this.fire("edited")

        return this
    }
}