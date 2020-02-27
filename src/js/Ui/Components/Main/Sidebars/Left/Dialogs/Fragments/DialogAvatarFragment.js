/**
 * @param id
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
export const DialogAvatarFragment = ({id, peer}) => {
    if (!peer) {
        return (
            <div id={id} className={`avatar placeholder-0`}>
                <span>$</span>
                <div className="avatar-outer" css-opacity="0"/>
            </div>
        )
    }

    let hasAvatar = !peer.photo.isEmpty && !peer.photo._isFetchingSmall

    if (peer.isSelf) {
        return (
            <div id={id} className="avatar placeholder-saved placeholder-icon">
                <i className="tgico tgico-avatar_savedmessages"/>
            </div>
        )
    }

    if (peer.isDeleted) {
        return (
            <div id={id} className={`avatar placeholder-${peer.photo.letter.num} placeholder-icon`}>
                <i className="tgico tgico-avatar_deletedaccount"/>
            </div>
        )
    }
    if (hasAvatar) {
        return (
            <div id={id} className={`avatar`}>
                <span/>

                <div className="avatar-outer" css-opacity="1">
                    <img className="avatar-inner" src={peer.photo.smallUrl} alt={peer.photo.letter.text}/>
                </div>

            </div>
        )
    } else {
        return (
            <div id={id} className={`avatar placeholder-${peer.photo.letter.num}`}>
                <span>{peer.photo.letter.text}</span>

                <div className="avatar-outer" css-opacity="0">

                </div>

            </div>
        )
    }
}
