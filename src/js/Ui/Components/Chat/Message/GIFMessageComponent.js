import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import VideoComponent from "./Video/VideoComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"

class GIFMessageComponent extends GeneralMessageComponent {

    render() {
        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad showUsername={false}
                                    bubbleRef={this.bubbleRef}>
                <VideoComponent message={this.message} autodownload autoplay controls={false} loop muted/>
                <MessageTimeComponent message={this.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }
}

export default GIFMessageComponent