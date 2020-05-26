import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {StickerManager} from "../../../../../Api/Stickers/StickersManager"
import UIEvents from "../../../../EventBus/UIEvents"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"

let diceNumber = 0;

class DiceMessageComponent extends GeneralMessageComponent {

    state = {
        idle: true, //not sure do we need to store this
        sticker: undefined
    }

    init() {
        super.init();
        this.state.sticker = StickerManager.getDiceSet(this.message.emoji).documents[0];
        this.state.sticker.idleId = diceNumber++;
    }

    appEvents(E) {
        E.bus(UIEvents.General)
            .on("sticker.loop", this.onStickerLoop)
    }

    render() {
        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>

                <BetterStickerComponent width={200} document={this.state.sticker}/>

                <MessageTimeComponent message={this.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }

    onStickerLoop = (e) => {
        if (this.state.idle && e.sticker === this.state.sticker) {
            this.setState({
                idle: false,
                sticker: StickerManager.getDice(this.message.value, this.message.emoji)
            })
        }
    }
}

export default DiceMessageComponent
