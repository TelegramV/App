import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import VUI from "../../../../VUI"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"
import {StickerSetModal} from "../../../Modals/StickerSetModal"
import StickerSet from "../../../../../Api/Stickers/StickerSet"
import {MessageType} from "../../../../../Api/Messages/Message"
import Settings from "../../../../../Api/Settings/Settings"

class AnimatedStickerMessageComponent extends GeneralMessageComponent {
    render({message, showDate}) {
        let stickerSet = new StickerSet(message.media.document.attributes.find(attr => attr._ === "documentAttributeSticker").stickerset);
        let isEmoji = message.type === MessageType.ANIMATED_EMOJI;
        const width = 200 * (isEmoji ? Settings.get("app_config.emojies_animated_zoom", 1) : 1)
        
        return (
            <MessageWrapperFragment message={message}
                                    transparent={true}
                                    noPad
                                    avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}
                                    showDate={showDate}>

                <BetterStickerComponent 
                    clickable={!stickerSet.isEmpty()}
                    onClick={() => {
                        if(!stickerSet.isEmpty() && !isEmoji) VUI.Modal.open(<StickerSetModal set={stickerSet}/>)
                    }} 
                    width={width} 
                    document={message.raw.media.document}
                />

                <MessageTimeComponent message={message} bg={true}/>

            </MessageWrapperFragment>
        )
    }
}

export default AnimatedStickerMessageComponent