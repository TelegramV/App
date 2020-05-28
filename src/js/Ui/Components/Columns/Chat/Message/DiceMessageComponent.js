import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {StickerManager} from "../../../../../Api/Stickers/StickersManager"
import UIEvents from "../../../../EventBus/UIEvents"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"

let diceNumber = 0;

class DiceMessageComponent extends GeneralMessageComponent {

    /*state = {
        idle: true, //not sure do we need to store this
        sticker: undefined
    }*/

    init() {
        super.init();
        /*StickerManager.getDiceSet(this.message.emoji).then(set => {
            console.log(this);
            this.setState({
                sticker: set.documents[0]
            });
            this.state.sticker.idleId = diceNumber++;
        })*/
    }

    /*appEvents(E) {
        E.bus(UIEvents.General)
            .on("sticker.loop", this.onStickerLoop)
    }*/

    componentDidMount() {
        super.componentDidMount()
        StickerManager.getDice(this.message.value, this.message.emoji).then(sticker => {
            this.sticker = sticker
            this.forceUpdate();
        })
    }

    render() {
        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>

                {this.sticker ? 
                    <BetterStickerComponent width={200} document={this.sticker} autoplay={true} playOnHover={false} paused={false}/>
                    :
                    <div css-height={"200px"}/>
                }

                <MessageTimeComponent message={this.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }

    /*onStickerLoop = (e) => {
        if (this.state.idle && e.sticker === this.state.sticker) {
            StickerManager.getDice(this.message.value, this.message.emoji).then(sticker => {
                this.setState({
                    idle: false,
                    sticker: sticker
                })
            })
        }
    }*/
}

export default DiceMessageComponent
