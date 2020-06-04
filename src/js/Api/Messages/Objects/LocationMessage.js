// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class LocationMessage extends AbstractMessage {

    type = MessageType.GEO

    get geo() {
    	return this.raw.media?.geo
    }

    get fullUrl() {
    	let lat = this.geo.lat;
	    let long = this.geo.long;
	    let zoom = this.zoom;
	    let latlong = `${lat},${long}`;
	    let url = "https://maps.google.com/maps?q=" + latlong + "&ll=" + latlong + "&z=" + zoom;
	    return url;
    }

    get zoom() {
    	return 16; //idk if we need to adapt...
    }
}