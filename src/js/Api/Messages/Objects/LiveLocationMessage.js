// @flow

import {LocationMessage} from "./LocationMessage"
import {MessageType} from "../Message"

export class LiveLocationMessage extends LocationMessage {

    type = MessageType.GEO_LIVE

    get period() {
    	return this.raw.media?.period
    }
}