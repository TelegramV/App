import AvatarFragment from "./AvatarFragment"

export const ContactFragment = ({url, name = " ", status, time, onClick, peer}) => {
    return (
        <div class="contact-card rp" onClick={onClick}>
            <AvatarFragment peerPhoto={peer.photo} deleted={peer.isDeleted}/>
            <div class="info-container">
                <div class="top">
                    <div class="name">{name}</div>
                    {time ? <div class="time">{time}</div> : ""}
                </div>
                <div class="status">{status}</div>
            </div>
        </div>
    )
}