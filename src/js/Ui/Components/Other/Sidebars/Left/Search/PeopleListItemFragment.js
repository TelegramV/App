import AppSelectedChat from "../../../../../Reactive/SelectedChat"
import AvatarFragment from "../../../../Basic/AvatarFragment"

export const PeopleListItemFragment = ({name, peer}) => {
    return (
        <div class="people-list-item" onClick={() => selectPeer(peer)}>
            <AvatarFragment peer={peer}/>
            <div class="name">{name}</div>
        </div>
    )
}

const selectPeer = (peer) => {
    AppSelectedChat.select(peer)
}