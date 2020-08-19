import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"

class TTLMessageComponent extends GeneralMessageComponent {

    render({ message, showDate }) {
        const text = this.makeMessage(message)
        return (
            <div className="service">
                <div className="service-msg">{Array.isArray(text) ? text.flat(Infinity) : text}</div>
            </div>
        )
    }

    makeMessage = (message) => {
        if (message.media._ === "messageMediaPhoto") {
        	if (!message.media.photo) {
        		return this.l("lng_ttl_photo_expired");
        	}

            if (message.from.isSelf) {
                return this.l("lng_ttl_photo_sent");
            } else {
                return this.l("lng_ttl_photo_received", {
                    from: this.wrapPeer(message.from)
                });
            }
        } else {
        	if (!message.media.document) {
        		return this.l("lng_ttl_video_expired");
        	}

            if (message.from.isSelf) {
                return this.l("lng_ttl_video_sent");
            } else {
                return this.l("lng_ttl_video_received", {
                    from: this.wrapPeer(message.from)
                });
            }
        }
    }

    wrapPeer = (peer) => {
        if (!peer) return "UNKNOWN USER";
        return (<span class="clickable" onClick={_ => {
            AppSelectedInfoPeer.select(peer)
        }}>{peer.name}</span>);
    }
}

export default TTLMessageComponent