export const ContactFragment = ({url, name = " ", status, time, onClick}) => {
    return (
        <div class="contact-card" onClick={onClick}>
            <div class="photo-container">
                <img src={url}/>
            </div>
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