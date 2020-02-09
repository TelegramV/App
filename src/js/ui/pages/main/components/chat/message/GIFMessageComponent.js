import MessageWrapperFragment from "./common/MessageWrapperFragment";
import MessageTimeComponent from "./common/MessageTimeComponent";
import VideoComponent from "./video/VideoComponent"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class GIFMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad showUsername={false} bubbleRef={this.bubbleRef}>
                <VideoComponent message={this.message} autodownload={true} autoplay={true} controls={false} loop={true}/>
                <MessageTimeComponent message={this.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }
}

export default GIFMessageComponent