import VCheckbox from "../../../../../Elements/Input/VCheckbox";

export const DialogInfoDetailsCheckboxFragment = ({text, label, checked = false, onChange}) => {
    return (
        <div className="details">
            <div className="notifications-checkbox">
                <VCheckbox checked={checked} input={onChange} />
            </div>
            <div className="line">
                <div className="text">{text}</div>
                <div className="label">{label}</div>
            </div>
        </div>
    )
}