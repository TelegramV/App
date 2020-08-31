import MessageTimeFragment from "./Common/MessageTimeFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent";
import VUI from "../../../../VUI";
import BetterStickerComponent from "../../../Basic/BetterStickerComponent";
import {StickerSetModal} from "../../../Modals/StickerSetModal";
import StickerSet from "../../../../../Api/Stickers/StickerSet";
import {MessageType} from "../../../../../Api/Messages/Message";
import Settings from "../../../../../Api/Settings/Settings";
import MessageWrapperFragment from "./Common/MessageWrapperFragment";

class AnimatedStickerMessageComponent extends GeneralMessageComponent {

    state = {
        paused: true
    };

    render({message, showDate}, {paused}) {
        let stickerSet = new StickerSet(message.media.document.attributes.find(attr => attr._ === "documentAttributeSticker").stickerset);
        let isEmoji = message.type === MessageType.ANIMATED_EMOJI;
        const width = 200 * (isEmoji ? Settings.get("app_config.emojies_animated_zoom", 1) : 1);

        return (
            MessageWrapperFragment(
                {message, transparent: true, noPad: true, showDate},
                <>
                    <BetterStickerComponent
                        clickable={!stickerSet.isEmpty()}
                        onClick={() => {
                            if (!stickerSet.isEmpty() && !isEmoji) VUI.Modal.open(<StickerSetModal set={stickerSet}/>);
                        }}
                        width={width}
                        autoplay
                        loop
                        playOnHover={false}
                        paused={paused}
                        document={message.raw.media.document}
                    /> {MessageTimeFragment({message, bg: true})}
                </>
            )
        );
    }

    onElementHidden() {
        super.onElementHidden();
        console.log("on hidden");
        this.setState({
            paused: true
        });
    }

    onElementVisible() {
        super.onElementVisible();

        this.setState({
            paused: false
        });

    }
}

export default AnimatedStickerMessageComponent;