// @flow

import {LocationMessage} from "./LocationMessage"
import {MessageType} from "../Message"

export class VenueMessage extends LocationMessage {

    type = MessageType.VENUE

    get title() {
        return this.raw.media?.title
    }

    get address() {
        return this.raw.media?.address
    }

    get provider() {
        return this.raw.media?.provider
    }

    get venueId() {
        return this.raw.media?.venue_id
    }

    get venueType() {
        return this.raw.media?.venue_type
    }
    
}