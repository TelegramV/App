import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"
import FileManager from "../../../../../Api/Files/FileManager"

class GIFMessageComponent extends GeneralMessageComponent {
    state = {
        paused: true
    }

    render({message, showDate}) {
        return (
            <MessageWrapperFragment message={message} showUsername={false}
                                    bubbleRef={this.bubbleRef} outerPad={message.text.length > 0}
                                    showDate={showDate}>
                <BetterVideoComponent document={message.raw.media.document}
                                      autoDownload
                                      playsinline
                                      loop
                                      alwaysShowVideo
                                      paused={this.state.paused}
                                      autoplay
                                      streamable
                                      infoContainer={() => {
                                          return (
                                              <div style={{
                                                  display: FileManager.isPending(message.raw.media.document) ? "block" : "none",
                                              }}
                                                   className="photo-info">{String(Math.floor(FileManager.getPercentage(message.raw.media.document)))}%
                                              </div>
                                          )
                                      }}
                                      muted/>
                <MessageTimeComponent message={message} bg={true}/>
            </MessageWrapperFragment>
        )
    }

    onElementHidden() {
        super.onElementHidden();
        console.log("autoplay = false")
        this.setState({
            paused: true
        })
    }

    onElementVisible() {
        super.onElementVisible();
        console.log("autoplay = true")

        this.setState({
            paused: false
        })
    }
}

export default GIFMessageComponent