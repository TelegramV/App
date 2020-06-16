import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import MessageWrapperFragment from "../Common/MessageWrapperFragment";
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import UIEvents from "../../../../../EventBus/UIEvents";
import BetterVideoComponent from "../../../../Basic/BetterVideoComponent"
import DocumentParser from "../../../../../../Api/Files/DocumentParser"
import {formatAudioTime} from "../../../../../Utils/utils"
import {DocumentMessagesTool} from "../../../../../Utils/document"
import FileManager from "../../../../../../Api/Files/FileManager"
import VSpinner from "../../../../../Elements/VSpinner"

class VideoMessageComponent extends GeneralMessageComponent {

    render({message}) {
        const document = message.raw.media.document;
        const text = message.parsed && <TextWrapperComponent message={message}/>;
        const info = DocumentParser.attributeVideo(document);

        return (
            <MessageWrapperFragment message={message} noPad showUsername={false} outerPad={text !== ""}
                                    avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>

                <BetterVideoComponent document={message.raw.media.document}
                                      onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: this.props.message})}
                                      autoPlay
                                      infoContainer={
                                          ({currentTime}) => (
                                              <>
                                                  <div className="play-button"
                                                       onClick={event => event.stopPropagation()}>
                                                      <i className="tgico tgico-play"/>
                                                  </div>
                                                  <div className="video-info"
                                                       onClick={event => {
                                                           event.stopPropagation()

                                                           if (!FileManager.isDownloaded(document)) {
                                                               if (FileManager.isPending(document)) {
                                                                   FileManager.cancel(document)
                                                               } else {
                                                                   FileManager.downloadVideo(document)
                                                               }
                                                           }
                                                       }}>
                                                      {
                                                          FileManager.isDownloaded(document) ?
                                                              <div className="done">
                                                                  {formatAudioTime(info.duration - currentTime)}
                                                                  <i className="tgico tgico-nosound"/>
                                                              </div>
                                                              :
                                                              <div className="download">
                                                                  <div class="icon">
                                                                      {!FileManager.isPending(document) &&
                                                                      <i className="tgico tgico-clouddownload"/>}
                                                                      {FileManager.isPending(document) &&
                                                                      <VSpinner white strokeWidth={3}/>}
                                                                  </div>
                                                                  <div className="info">
                                                              <span class="duration">
                                                                  {formatAudioTime(info.duration)}
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
                                          )
                                      }
                                      muted/>

                {!text ? <MessageTimeComponent message={message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }

}

export default VideoMessageComponent;