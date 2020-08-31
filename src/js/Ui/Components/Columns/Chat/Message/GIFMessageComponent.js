import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeFragment from "./Common/MessageTimeFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent";
import BetterVideoComponent from "../../../Basic/BetterVideoComponent";
import FileManager from "../../../../../Api/Files/FileManager";

class GIFMessageComponent extends GeneralMessageComponent {
    state = {
        paused: true
    };

    render({message, showDate}) {
        return (
            MessageWrapperFragment(
                {message, showDate, outerPad: message.text.length > 0, showUsername: false},
                <>
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
                                                  <div className="photo-info">
                                                  <span style={{
                                                      "margin-right": FileManager.isPending(message.raw.media.document) ? "5px" : "0"
                                                  }}>GIF</span>
                                                      <span style={{
                                                          "display": FileManager.isPending(message.raw.media.document) ? "block" : "none",
                                                      }}>{String(Math.floor(FileManager.getPercentage(message.raw.media.document)))}%</span>
                                                  </div>
                                              );
                                          }}
                                          muted/>
                    {MessageTimeFragment({message, bg: true})}
                </>
            )
        );
    }

    onElementHidden() {
        super.onElementHidden();
        console.log("autoplay = false");
        this.setState({
            paused: true
        });
    }

    onElementVisible() {
        super.onElementVisible();
        console.log("autoplay = true");

        this.setState({
            paused: false
        });
    }
}

export default GIFMessageComponent;