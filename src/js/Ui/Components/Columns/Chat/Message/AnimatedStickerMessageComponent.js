import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import VUI from "../../../../VUI"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"

class AnimatedStickerMessageComponent extends GeneralMessageComponent {
    render() {
        return (
            <MessageWrapperFragment message={this.message}
                                    transparent={true}
                                    noPad
                                    avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>

                <BetterStickerComponent onClick={() => {
                    VUI.Modal.open(<div>TODO: implement me!</div>)
                }} width={200} document={this.message.raw.media.document}/>

                <MessageTimeComponent message={this.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }
}

export default AnimatedStickerMessageComponent