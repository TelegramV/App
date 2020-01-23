export const DialogInfoComponent = () => {
    return (
        <div className="dialog-info">
                <div class="header">
                    <span class="btn-icon tgico tgico-close rp rps"></span>
                    <div class="title">Info</div>
                    <span class="btn-icon tgico tgico-more rp rps"></span>
                </div>
            <div class="content">
                <div class="photo-container">
                    <img class="photo" src=""/>
                </div>
                <div class="description">
                    <div class="name">Noboby</div>
                    {/*<div class="status">online</div>*/}
                    <div class="subscribers">335,356 subscribers</div>
                </div>
                <div class="details">
                    <span class="icon tgico tgico-info"></span>
                    <div class="line">
                        <div class="text">Born in 2009 in Sweden</div>
                        <div class="label">Bio</div>
                    </div>
                </div>
                <div class="details">
                    <span class="icon tgico tgico-username"></span>
                    <div class="line">
                        <div class="text">notch</div>
                        <div class="label">Username</div>
                    </div>
                </div>
                <div class="details">
                    <span class="icon tgico tgico-phone"></span>
                    <div class="line">
                        <div class="text">+380 12345 67 89</div>
                        <div class="label">Phone</div>
                    </div>
                </div>
                <div class="details">
                    <div class="notifications-checkbox">
                        <div className="checkbox-input">
                        <label><input type="checkbox" name="notifications" id="notifications"/><span className="checkmark">
                            <div className="tgico tgico-check"/>
                        </span>
                        </label>
                        </div>
                    </div>
                    <div class="line">
                        <div class="text">Notifications</div>
                        <div class="label">Enabled</div>
                    </div>
                </div>
                <div class="materials"> 
                    <div class="header">
                        <div class="item selected">Media</div>
                        <div class="item">Docs</div>
                        <div class="item">Links</div>
                        <div class="item">Audio</div>
                    </div>
                </div>
            </div>
            </div>
    )
}