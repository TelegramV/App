import Component from "../V/VRDOM/Component";
import ChatInfoAvatarComponent from "./pages/main/components/chat/chatInfo/ChatInfoAvatarComponent";
import {PhotoMessage} from "../Api/Messages/Objects/PhotoMessage";
import {VComponent} from "../V/VRDOM/component/VComponent";

export let MediaViewerManager

export class MediaViewerComponent extends Component {
    constructor(props) {
        super(props)
        this.useProxyState = false
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
                                <i className="tgico tgico-delete rp rps"></i>
                                <i className="tgico tgico-forward rp rps"></i>
                                <i className="tgico tgico-download rp rps"></i>
                                <i className="tgico tgico-close rp rps"></i>
                            </div>
                        </div>
                        <div className="media">
                            <img src={this.state.message.srcUrl} alt=""/>
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
        if(message instanceof PhotoMessage && !message.loaded) {
            message.fetchMax().then(l => this.__patch())
        }
        this.state.hidden = false
        this.state.message = message
        this.__patch()
    }
}