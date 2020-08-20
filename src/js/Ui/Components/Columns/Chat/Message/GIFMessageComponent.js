import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"

class GIFMessageComponent extends GeneralMessageComponent {

    render({message, showDate}) {
        return (
            <MessageWrapperFragment message={message} showUsername={false}
                                    bubbleRef={this.bubbleRef} outerPad={message.text.length > 0}
                                    showDate={showDate}>
                <BetterVideoComponent document={message.raw.media.document}
                                      autoDownload
                                      playsinline
                                      loop
                                      autoplay
                                      muted/>
                <MessageTimeComponent message={message} bg={true}/>
            </MessageWrapperFragment>
        )
    }
}

export default GIFMessageComponent