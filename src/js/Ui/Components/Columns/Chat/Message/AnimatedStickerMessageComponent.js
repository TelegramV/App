import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import VUI from "../../../../VUI"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"
import {StickerSetModal} from "../../../Modals/StickerSetModal"
import StickerSet from "../../../../../Api/Stickers/StickerSet"

class AnimatedStickerMessageComponent extends GeneralMessageComponent {
    render({message, showDate}) {
        let stickerSet = new StickerSet(message.raw.media.document.attributes.find(attr => attr._ === "documentAttributeSticker").stickerset);

        return (
            <MessageWrapperFragment message={message}
                                    transparent={true}
                                    noPad
                                    avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}
                                    showDate={showDate}>

                <BetterStickerComponent onClick={() => {
                    VUI.Modal.open(<StickerSetModal set={stickerSet}/>)
                }} width={200} document={message.media.document}/>

                <MessageTimeComponent message={message} bg={true}/>

            </MessageWrapperFragment>
        )
    }
}

export default AnimatedStickerMessageComponent