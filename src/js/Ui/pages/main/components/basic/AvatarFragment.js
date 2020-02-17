import AppSelectedInfoPeer from "../../../../reactive/SelectedInfoPeer"

const AvatarFragment = ({peerPhoto, saved, deleted}) => {
    let hasAvatar = !peerPhoto.isEmpty && !peerPhoto._isFetchingSmall

    if (saved) {
        return (
            <div onClick={() => AppSelectedInfoPeer.select(peerPhoto.peer)} className="avatar placeholder-saved placeholder-icon">
                <i className="tgico tgico-avatar_savedmessages"/>
            </div>
        )
    }

    if (deleted) {
        return (
            <div className={`avatar placeholder-${peerPhoto.letter.num} placeholder-icon`}>
                <i className="tgico tgico-avatar_deletedaccount"/>
            </div>
        )
    }

    if (hasAvatar) {
        return (
            <div onClick={() => AppSelectedInfoPeer.select(peerPhoto.peer)}
                 id="messages-photo"
                 className="avatar"
                 style={`background-image: url(${peerPhoto.smallUrl});`}>
            </div>
        )
    } else {
        return (
            <div onClick={() => AppSelectedInfoPeer.select(peerPhoto.peer)}
                 className={`avatar placeholder-${peerPhoto.letter.num}`}>
                <span>{peerPhoto.letter.text}</span>

                <div className="avatar-outer" css-opacity="0">

                </div>

            </div>
        )
    }
}

export default AvatarFragment