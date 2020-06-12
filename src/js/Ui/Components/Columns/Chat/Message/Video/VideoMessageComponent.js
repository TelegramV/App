import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import MessageWrapperFragment from "../Common/MessageWrapperFragment";
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import UIEvents from "../../../../../EventBus/UIEvents";
import BetterVideoComponent from "../../../../Basic/BetterVideoComponent"
import DocumentParser from "../../../../../../Api/Files/DocumentParser"
import {formatAudioTime} from "../../../../../Utils/utils"
import {DocumentMessagesTool} from "../../../../../Utils/document"

class VideoMessageComponent extends GeneralMessageComponent {

    render({message}) {
        const text = (message.text.length > 0) ? <TextWrapperComponent message={message}/> : ""
        const info = DocumentParser.attributeVideo(message.raw.media.document)

        return (
            <MessageWrapperFragment message={message} noPad showUsername={false} outerPad={text !== ""}
                                    avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>

                <BetterVideoComponent document={message.raw.media.document}
                                      onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: this.props.message})}
                                      playOnHover
                                      infoContainer={
                                          () => (
                                              <>
                                                  <div className="play-button"
                                                       onClick={event => event.stopPropagation()}>
                                                      <i className="tgico tgico-play"/>
                                                  </div>
                                                  <div className="video-info"
                                                       onClick={event => event.stopPropagation()}>
                                                      {
                                                          false
                                                          &&
                                                          <div className="done">
                                                              {formatAudioTime(info.duration)}
                                                              <i className="tgico tgico-nosound"/>
                                                          </div>
                                                      }
                                                      <div className="download">
                                                          <i className="tgico tgico-clouddownload"/>
                                                          <div className="info">
                                                              <span
                                                                  class="duration">{formatAudioTime(info.duration)}</span>
                                                              <span class="size">
                                                              {DocumentMessagesTool.formatSize(message.raw.media.document.size)}
                                                          </span>
                                                          </div>
                                                      </div>
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