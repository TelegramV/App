import AppSelectedPeer from "../../../../../reactive/SelectedPeer"

export const ContactFragment = ({url, name = " ", status, peer}) => {
    return (
        <div class="contact" onClick={peer ? () => AppSelectedPeer.select(peer) : undefined}>
            <div class="photo-container">
                <img src={url}/>
            </div>
            <div class="info-container">
                <div class="name">{name}</div>
                <div class="status">{status}</div>
            </div>
        </div>
    )
}