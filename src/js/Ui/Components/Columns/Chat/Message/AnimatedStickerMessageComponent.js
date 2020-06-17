import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import VUI from "../../../../VUI"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"

class AnimatedStickerMessageComponent extends GeneralMessageComponent {
    render({message, showDate}) {
        return (
            <MessageWrapperFragment message={message}
                                    transparent={true}
                                    noPad
                                    avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}
                                    showDate={showDate}>

                <BetterStickerComponent onClick={() => {
                    VUI.Modal.open(<div>TODO: implement me!</div>)
                }} width={200} document={message.media.document}/>

                <MessageTimeComponent message={message} bg={true}/>

            </MessageWrapperFragment>
        )
    }
}

export default AnimatedStickerMessageComponent