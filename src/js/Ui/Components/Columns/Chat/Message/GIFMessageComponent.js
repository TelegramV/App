import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import VideoComponent from "./Video/VideoComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"

class GIFMessageComponent extends GeneralMessageComponent {

    render() {
        return (
            <MessageWrapperFragment message={this.props.message} showUsername={false}
                                    bubbleRef={this.bubbleRef} outerPad={this.props.message.text.length > 0}>
                <BetterVideoComponent message={this.props.message} autodownload autoplay={false} controls={false} loop muted/>
                <MessageTimeComponent message={this.props.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }
}

export default GIFMessageComponent