/**
 * @param id
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
import AvatarFragment from "../../../../Basic/AvatarFragment"

export const DialogAvatarFragment = ({peer}) => {
    return <AvatarFragment peer={peer} saved={true}/>
}
