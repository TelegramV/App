import AppSelectedInfoPeer from "../../Reactive/SelectedInfoPeer"

const AvatarFragment = ({peer, noSaved, showVideo, alwaysPlay, onClick, onMouseEnter, onMouseLeave}) => {
    //console.log("onMouseEnter", onMouseEnter)
    if (!peer) {
        return (
            <div className={`avatar placeholder-0`}>
                <span>?</span>
                <div className="avatar-outer" css-opacity="0"/>
            </div>
        )
    }

    let photo = peer.photo
    let deleted = peer.isDeleted
    let hasAvatar = !photo.isEmpty //&& !photo._isFetchingSmall

    if (!onClick) {
        onClick = () => {
            AppSelectedInfoPeer.select(peer)
        }
    }

    if (!noSaved && peer.isSelf) {
        return (
            <div onClick={onClick}
                 className="avatar placeholder-saved placeholder-icon">
                <i className="tgico tgico-avatar_savedmessages"/>
            </div>
        )
    }

    if (deleted) {
        return (
            <div className={`avatar placeholder-${photo.letter.num} placeholder-icon`}>
                <i className="tgico tgico-avatar_deletedaccount"/>
            </div>
        )
    }

    const url = photo.smallUrl;

    if (hasAvatar) {
        return (
            <div onClick={onClick}
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseLeave}
                 className="avatar"
                 css-opacity={url ? "1" : "0"}
                 css-background-image={`url(${url})`}>
                 { photo.hasVideo && photo.videoUrl && <video autoplay loop playsinline
                    src={(showVideo || alwaysPlay) ? photo.videoUrl : ""} // hide src if not playing
                    css-opacity={showVideo || alwaysPlay ? "1" : "0"}
                    /> 
                 }
            </div>
        )
    } else {
        return (
            <div onClick={onClick}
                 className={`avatar placeholder-${photo.letter.num}`}>
                <span>{photo.letter.text}</span>
                <div className="avatar-outer" css-opacity="0"/>
            </div>
        )
    }
}

export default AvatarFragment