export const DialogInfoDetailsCheckboxFragment = ({text, label}) => {
    return (
        <div className="details">
            <div className="notifications-checkbox">
                <div className="checkbox-input">
                    <label>
                        <input type="checkbox"/>
                        <span className="checkmark">
                        <div className="tgico tgico-check"/>
                    </span>
                    </label>
                </div>
            </div>
            <div className="line">
                <div className="text">{text}</div>
                <div className="label">{label}</div>
            </div>
        </div>
    )
}