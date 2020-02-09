import AppSelectedPeer from "../../../../../reactive/SelectedPeer"

export const ContactFragment = ({url, name = " ", status, onClick}) => {
    return (
        <div class="contact" onClick={onClick}>
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