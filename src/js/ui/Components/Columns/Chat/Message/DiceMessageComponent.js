import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import StickerComponent from "./Common/StickerComponent"
import {StickerManager} from "../../../../../Api/Stickers/StickersManager"
import UIEvents from "../../../../EventBus/UIEvents"

let diceNumber = 0;

class DiceMessageComponent extends GeneralMessageComponent {

	state = {
        idle: true,
        sticker: undefined
    }

    init() {
    	super.init();
    	this.state.sticker = StickerManager.getDiceSet(this.message.emoji).documents[0];
    	this.state.sticker.idleId=diceNumber++;
    }

	appEvents(E) {
        E.bus(UIEvents.General)
            .on("sticker.loop", this.onStickerLoop)
    }

    render() {
        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>

                <StickerComponent width={200} sticker={this.state.sticker}/>

                <MessageTimeComponent message={this.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }

    onStickerLoop = (e) => {
    	if(this.state.idle && e.sticker === this.state.sticker) {
    		this.setState({
    			idle: false,
    			sticker: StickerManager.getDice(this.message.value, this.message.emoji)
    		})
    	}
    }
}

export default DiceMessageComponent