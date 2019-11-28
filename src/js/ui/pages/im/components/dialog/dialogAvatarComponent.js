/**
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
export const DialogAvatarComponent = ({dialog}) => {
    let hasAvatar = dialog.peer.hasAvatar && dialog.peer._avatar !== undefined

    const classes = "avatar" + (!hasAvatar ? ` placeholder-${dialog.peer.avatarLetter.num}` : "")
    const letter = hasAvatar ? "" : dialog.peer.avatarLetter.text

    const cssBackgroundImage = hasAvatar ? `url(${dialog.peer._avatar})` : "none"
    const cssOpacity = hasAvatar ? 1 : 0

    return (
        <div className={classes}>
            <span>{letter}</span>

            <div className="avatar-inner"
                 css-background-image={cssBackgroundImage}
                 css-opacity={cssOpacity}/>
        </div>
    )
}
