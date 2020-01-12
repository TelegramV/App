const MessagesWrapperChatInfoComponent = {
    name: "MessagesWrapperChatInfoComponent",
    h({dialog}) {
        const peer = dialog.peer

        return (
            <div className="chat-info">
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