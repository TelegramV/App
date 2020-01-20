/**
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
export const DialogAvatarComponent = ({dialog}) => {
    let hasAvatar = !dialog.peer.photo.isEmpty && !dialog.peer.photo._isFetchingSmall

    if(dialog.peer.isSelf) {
        return (
            <div className="avatar placeholder-saved placeholder-icon">
                <i className="tgico tgico-avatar_savedmessages"/>
            </div>
        )
    }

    if(dialog.peer.isDeleted) {
        return (
            <div className={`avatar placeholder-${dialog.peer.photo.letter.num} placeholder-icon`}>
                <i className="tgico tgico-avatar_deletedaccount"/>
            </div>
        )
    }
    if (hasAvatar) {
        return (
            <div className={`avatar`}>
                <span/>

                <div className="avatar-outer" css-opacity="1">
                    <img className="avatar-inner" src={dialog.peer.photo.smallUrl} alt={dialog.peer.photo.letter.text}/>
                </div>

            </div>
        )
    } else {
        return (
            <div className={`avatar placeholder-${dialog.peer.photo.letter.num}`}>
                <span>{dialog.peer.photo.letter.text}</span>

                <div className="avatar-outer" css-opacity="0">

                </div>

            </div>
        )
    }
}
