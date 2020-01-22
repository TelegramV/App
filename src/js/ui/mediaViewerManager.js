import Component from "./framework/vrdom/component";
import ChatInfoAvatarComponent from "./pages/main/components/chat/chatInfo/chatInfoAvatarComponent";

export let MediaViewerManager

export class MediaViewerComponent extends Component {
    constructor(props) {
        super(props)
        MediaViewerManager = this
        this.state = {
            hidden: true,
        }
    }

    h() {
        return (
            <div className={["media-viewer-wrapper", this.state.hidden ? "hidden" : ""]}>
                {this.state.message ?
                    <div className="media-viewer" onClick={this.close}>
                        <div className="header">
                            <div className="left">
                                <ChatInfoAvatarComponent/>
                                <div className="text">
                                    <div className="name">{this.state.message.from.name}</div>
                                    <div className="time">{this.state.message.getDate("en", {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}</div>
                                </div>
                            </div>
                            <div className="right">
                                <i className="tgico tgico-delete"></i>
                                <i className="tgico tgico-forward"></i>
                                <i className="tgico tgico-download"></i>
                                <i className="tgico tgico-close"></i>
                            </div>
                        </div>
                        <div className="media">
                            <img src={this.state.message.media.photo.real.src} alt=""/>
                        </div>
                        <div className="caption">{this.state.message.text}</div>
                    </div>
                    : ""}
            </div>
        )
    }

    close() {
        this.state.hidden = true
        this.__patch()
    }

    open(message) {
        this.state.hidden = false
        this.state.message = message
        this.__patch()
    }
}