import {UserPeer} from "../../../../../dataObjects/peer/userPeer"
import {ChannelPeer} from "../../../../../dataObjects/peer/channelPeer"
import {GroupPeer} from "../../../../../dataObjects/peer/groupPeer"
import {SupergroupPeer} from "../../../../../dataObjects/peer/supergroupPeer"
import {BotPeer} from "../../../../../dataObjects/peer/botPeer"

const MessagesWrapperChatInfoComponent = {
    name: "MessagesWrapperChatInfoComponent",
    h({dialog}) {
        if (!dialog) {
            return (
                <div id="messages-wrapper-chat-info" className="chat-info">
                    <div className="person">
                        <div id="messages-photo"
                             className="avatar placeholder-1">
                            ...
                        </div>
                        <div className="content">
                            <div className="top">
                                <div id="messages-title" className="title">
                                    ...
                                </div>
                            </div>
                            <div className="bottom">
                                <div id="messages-online" className="info">...</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        const peer = dialog.peer

        let status = undefined

        if (peer instanceof UserPeer) {
            if (peer.onlineStatus.status === "bot") {
                status = peer.onlineStatus.status
            } else {
                status = peer.onlineStatus.online ? "online" : "last seen " + peer.onlineStatus.status
            }
        } else if (peer instanceof ChannelPeer) {
            if (peer.full) {
                const user = peer.full.participants_count === 1 ? "member" : "members"
                status = `${peer.full.participants_count} ${user}`
            } else {
                status = "loading info..."
            }
        } else if (peer instanceof SupergroupPeer) {
            if (peer.full) {
                const user = peer.full.participants_count === 1 ? "member" : "members"
                status = `${peer.full.participants_count} ${user}, ${peer.full.online_count} online`
            } else {
                status = "loading info..."
            }
        } else if (peer instanceof GroupPeer) {
            if (peer.full) {
                const user = peer.peer.participants_count === 1 ? "member" : "members"
                status = `${peer.peer.participants_count} ${user}, ${peer.full.online_count} online`
            } else {
                status = "loading info..."
            }
        } else if (peer instanceof BotPeer) {
            status = "bot"
        }

        return (
            <div id="messages-wrapper-chat-info" className="chat-info">
                <div className="person">
                    <div id="messages-photo"
                         className={"avatar " + (!peer.hasAvatar ? `placeholder-${peer.avatarLetter.num}` : "")}
                         style={`background-image: url(${peer._avatar});`}>
                        {!peer.hasAvatar ? peer.avatarLetter.text[0] : ""}
                    </div>
                    <div className="content">
                        <div className="top">
                            <div id="messages-title" className="title">
                                {peer.peerName}
                            </div>
                        </div>
                        <div className="bottom">
                            <div id="messages-online" className="info">{status}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessagesWrapperChatInfoComponent