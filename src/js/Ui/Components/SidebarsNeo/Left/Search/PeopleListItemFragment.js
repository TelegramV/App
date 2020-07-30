import AppSelectedChat from "../../../../Reactive/SelectedChat"
import AvatarComponent from "../../../Basic/AvatarComponent"

export const PeopleListItemFragment = ({name, peer}) => {
    return (
        <div class="people-list-item" onClick={() => selectPeer(peer)}>
            <AvatarComponent peer={peer}/>
            <div class="name">{name}</div>
        </div>
    )
}

const selectPeer = (peer) => {
    AppSelectedChat.select(peer)
}