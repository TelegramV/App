import AppSelectedPeer from "../../../../../reactive/SelectedPeer"

export const PeopleListItemFragment = ({url, name, peer}) => {
    return (
        <div class="people-list-item" onClick={() => selectPeer(peer)}>
            <div class="photo-container">
                <img src={url}/>
            </div>
            <div class="name">{name}</div>
        </div>
    )
}

const selectPeer = (peer) => {
    AppSelectedPeer.select(peer)
}