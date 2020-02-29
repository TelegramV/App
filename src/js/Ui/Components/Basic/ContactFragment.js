import AvatarFragment from "./AvatarFragment"

export const ContactFragment = ({name = " ", status, time, onClick, peer}) => {
    return (
        <div class="contact-card rp" onClick={onClick}>
            <AvatarFragment peer={peer}/>

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