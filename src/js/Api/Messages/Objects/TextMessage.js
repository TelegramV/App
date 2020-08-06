// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import {parse} from "twemoji-parser"

export class TextMessage extends AbstractMessage {

    type = MessageType.TEXT

    get isBigEmojis() {
    	if(this.text.length > 0) {
    		// optimization? test for a-zA-Z before testing for emojis
    		const emojis = parse(this.text);
    		if(emojis.length > 0 && emojis.length < 4) {
    			//check for gaps
    			let previousEnd = 0;
    			for(let emoji of emojis) {
    				if(emoji.indices[0] - previousEnd > 0) return false;
    				previousEnd = emoji.indices[1];
    			}
    			return true;
    		}
    	}
    	return false;
    }
}