export const DialogInfoDetailsCheckboxFragment = ({text, label, checked = false, onChange}) => {
    return (
        <div className="details">
            <div className="notifications-checkbox">
                <div className="checkbox-input">
                    <label>
                        {checked ?
                            <input type="checkbox" checked onChange={l => onChange(l)}/>
                        : <input type="checkbox" onChange={l => onChange(l)}/>
                        }
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