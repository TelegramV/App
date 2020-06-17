import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"

class GIFMessageComponent extends GeneralMessageComponent {

    render({showDate}) {
        return (
            <MessageWrapperFragment message={this.props.message} showUsername={false}
                                    bubbleRef={this.bubbleRef} outerPad={this.props.message.text.length > 0}
                                    showDate={showDate}>
                <BetterVideoComponent document={this.props.message.raw.media.document}
                                      muted
                                      autoDownload
                                      autoPlay
                                      playOnHover/>
                <MessageTimeComponent message={this.props.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }
}

export default GIFMessageComponent