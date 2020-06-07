import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"

class GIFMessageComponent extends GeneralMessageComponent {

    render() {
        return (
            <MessageWrapperFragment message={this.props.message} showUsername={false}
                                    bubbleRef={this.bubbleRef} outerPad={this.props.message.text.length > 0}>
                <BetterVideoComponent document={this.props.message.raw.media.document}
                                      muted
                                      playOnHover/>
                <MessageTimeComponent message={this.props.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }
}

export default GIFMessageComponent