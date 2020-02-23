import MessageWrapperFragment from "./common/MessageWrapperFragment";
import MessageTimeComponent from "./common/MessageTimeComponent"
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import StickerComponent from "./common/StickerComponent"

class AnimatedStickerMessageComponent extends GeneralMessageComponent {
    render() {
        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>

                <StickerComponent width={200} sticker={this.message.raw.media.document}/>

                <MessageTimeComponent message={this.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }
}

export default AnimatedStickerMessageComponent