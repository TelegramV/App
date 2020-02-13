import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import AvatarFragment from "../../../components/basic/AvatarFragment"

export const PeopleListItemFragment = ({url, name, peer}) => {
    return (
        <div class="people-list-item" onClick={() => selectPeer(peer)}>
            <AvatarFragment peerPhoto={peer.photo} deleted={peer.isDeleted}/>
            <div class="name">{name}</div>
        </div>
    )
}

const selectPeer = (peer) => {
    AppSelectedPeer.select(peer)
}