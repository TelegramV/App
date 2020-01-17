/**
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
export const DialogAvatarComponent = ({dialog}) => {
    let hasAvatar = !dialog.peer.photo.isEmpty && !dialog.peer.photo._isFetchingSmall

    const classes = {
        "avatar": true,
    }

    classes[`placeholder-${dialog.peer.photo.letter.num}`] = !hasAvatar

    const letter = hasAvatar ? "" : dialog.peer.photo.letter.text

    const cssBackgroundImage = hasAvatar ? `url(${dialog.peer.photo.smallUrl})` : "none"
    const cssOpacity = hasAvatar ? 1 : 0

    return (
        <div className={classes}>
            <span>{letter}</span>

            <div className="avatar-outer" css-opacity={cssOpacity}>
            {
                hasAvatar ?
                    <img className="avatar-inner" src={dialog.peer.photo.smallUrl}/>
                    :
                    ""
            }
            </div>

            {/*<div className="avatar-inner"*/}
            {/*     css-background-image={cssBackgroundImage}*/}
            {/*     css-opacity={cssOpacity}/>*/}
        </div>
    )
}
