import AppSelectedPeer from "../../../../../Reactive/SelectedPeer"
import AvatarFragment from "../../../basic/AvatarFragment"

export const PeopleListItemFragment = ({name, peer}) => {
    return (
        <div class="people-list-item" onClick={() => selectPeer(peer)}>
            <AvatarFragment peer={peer}/>
            <div class="name">{name}</div>
        </div>
    )
}

const selectPeer = (peer) => {
    AppSelectedPeer.select(peer)
}