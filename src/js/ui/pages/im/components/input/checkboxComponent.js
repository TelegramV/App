export const CheckboxComponent = ({label, checked = false, id}) => {
    return (
        <div className="checkbox-input">
            <label>
                {
                    checked ?
                        <input type="checkbox" name={id} id={id} checked/>
                    :
                        <input type="checkbox" name={id} id={id}/>
                }
                <span className="checkmark">
                        <div className="tgico tgico-check"/>
                </span>
            </label>
            <span className="checkbox-label">{label}</span>
        </div>
    )
}