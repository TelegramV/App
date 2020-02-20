import MessageWrapperFragment from "./common/MessageWrapperFragment";
import MessageTimeComponent from "./common/MessageTimeComponent";
import VideoComponent from "./video/VideoComponent"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class GIFMessageComponent extends GeneralMessageComponent {

    render() {
        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad showUsername={false} bubbleRef={this.bubbleRef}>
                <VideoComponent message={this.message} autodownload autoplay controls={false} loop muted/>
                <MessageTimeComponent message={this.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }
}

export default GIFMessageComponent