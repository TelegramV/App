import GeneralMessageComponent from "../Common/GeneralMessageComponent";
import MessageWrapperFragment from "../Common/MessageWrapperFragment";
import TextWrapperFragment from "../Common/TextWrapperFragment";
import MessageTimeFragment from "../Common/MessageTimeFragment";
import UIEvents from "../../../../../EventBus/UIEvents";
import BetterVideoComponent from "../../../../Basic/BetterVideoComponent";
import DocumentParser from "../../../../../../Api/Files/DocumentParser";
import {formatTime} from "../../../../../../Utils/date";
import {DocumentMessagesTool} from "../../../../../Utils/document";
import FileManager from "../../../../../../Api/Files/FileManager";
import VSpinner from "../../../../../Elements/VSpinner";
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import {mediaViewerOpen} from "../../../../../Utils/mediaViewerOpen"

class VideoMessageComponent extends GeneralMessageComponent {
    state = {
        ...super.state,
        isMuted: true,
        paused: true
    };

    videoRef = VComponent.createComponentRef();

    render({message, showDate}, {isMuted}) {
        const document = message.raw.media.document;
        const text = message.parsed && TextWrapperFragment({message});
        const info = DocumentParser.attributeVideo(document);
        const isStreamable = DocumentParser.isVideoStreamable(document);

        return (
            MessageWrapperFragment(
                {message, showDate, showUsername: false, outerPad: text !== ""},
                <>
                    <BetterVideoComponent document={message.raw.media.document}
                                          onClick={this.videoClick}
                                          autoPlay
                                          paused={this.state.paused}
                                          alwaysShowVideo
                                          infoContainer={
                                              ({currentTime, isHovered, url}, $el: HTMLVideoElement) => {
                                                  const isPlaying = $el && !$el.paused;

                                                  return (
                                                      <>
                                                          <div className="play-button"
                                                               onClick={event => {
                                                                   event.stopPropagation();

                                                                   if (isStreamable) {
                                                                       this.$el.querySelector("video")?.pause();
                                                                       UIEvents.MediaViewer.fire("showMessage", {message});
                                                                   } else {
                                                                       if (!FileManager.isPending(document)) {
                                                                           FileManager.downloadVideo(document);
                                                                       }

                                                                       if (url) {
                                                                           if (isPlaying) {
                                                                               $el?.pause();
                                                                           } else {
                                                                               $el?.play();
                                                                           }
                                                                       }
                                                                   }
                                                               }}
                                                               css-display={isHovered ? "block" : "none"}>
                                                              <i className={`tgico tgico-${isPlaying ? "pause" : "play"}`}/>
                                                          </div>
                                                          <div className="video-info"
                                                               onClick={event => {
                                                                   event.stopPropagation();

                                                                   if (!FileManager.isDownloaded(document)) {
                                                                       if (FileManager.isPending(document)) {
                                                                           FileManager.cancel(document);
                                                                       } else {
                                                                           FileManager.downloadVideo(document);
                                                                       }
                                                                   } else {
                                                                       if (!isStreamable) {
                                                                           this.setState({
                                                                               isMuted: !isMuted,
                                                                           });
                                                                       }
                                                                   }
                                                               }}>
                                                              {
                                                                  FileManager.isDownloaded(document) ?
                                                                      <div className="done">
                                                                          {formatTime(info.duration - currentTime)}
                                                                          {isMuted && !isStreamable &&
                                                                          <i className="tgico tgico-nosound"/>}
                                                                      </div>
                                                                      :
                                                                      <div className="download">
                                                                          <div class="icon">
                                                                              {!FileManager.isPending(document) &&
                                                                              <i className="tgico tgico-clouddownload"/>}
                                                                              {FileManager.isPending(document) &&
                                                                              <VSpinner white strokeWidth={3}>
                                                                                  <div style={{
                                                                                      "width": "7px",
                                                                                      "height": "7px",
                                                                                      "background-color": "white",
                                                                                      "border-radius": "1px"
                                                                                  }}/>
                                                                              </VSpinner>}
                                                                          </div>
                                                                          <div className="info">
                                                              <span class="duration">
                                                                  {formatTime(info.duration)}
                                                              </span>
                                                                              <span class="size">
                                                                  {FileManager.isPending(document) && DocumentMessagesTool.formatSize(FileManager.getPendingSize(document)) + "/"}
                                                                                  {DocumentMessagesTool.formatSize(document.size)}
                                                              </span>
                                                                          </div>
                                                                      </div>
                                                              }
                                                          </div>
                                                      </>
                                                  );
                                              }
                                          }
                                          muted={isMuted} ref={this.videoRef}/>

                    {!text ? MessageTimeFragment({message, bg: true}) : ""}

                    {text}
                </>
            )
        );
    }

    videoClick = () => {
      this.$el.querySelector("video")?.pause();
      mediaViewerOpen(this.videoRef.component.$el, this.props.message)
    }

    onElementHidden() {
        super.onElementHidden();
        this.setState({
            paused: true
        });
    }

    onElementVisible() {
        super.onElementVisible();
        const document = this.props.message.raw.media.document;
        if (!FileManager.isDownloaded(document) && document.size < 2*1024*1024) { //limit 2 MB autodownload
            FileManager.downloadVideo(document);
        }

        this.setState({
            paused: false
        });

    }
}

export default VideoMessageComponent;