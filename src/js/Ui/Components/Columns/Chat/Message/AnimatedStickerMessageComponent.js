import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import StickerComponent from "./Common/StickerComponent"
import VUI from "../../../../VUI"

class AnimatedStickerMessageComponent extends GeneralMessageComponent {
    render() {
        return (
            <MessageWrapperFragment message={this.message}
                                    transparent={true}
                                    noPad
                                    avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>

                <StickerComponent onClick={() => {
                    VUI.Modal.open(<div>TODO: implement me!</div>)
                }} width={200} sticker={this.message.raw.media.document}/>

                <MessageTimeComponent message={this.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }
}

export default AnimatedStickerMessageComponent