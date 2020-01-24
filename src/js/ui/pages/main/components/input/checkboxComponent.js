const CheckboxComponent = ({label="", checked = false, id}) => {
    return (
        <div className="checkbox-input">
            <label htmlFor={id}>
                {
                    checked ?
                        <input type="checkbox" name={id} id={id} checked/>
                    :
                        <input type="checkbox" name={id} id={id}/>
                }
                <span className="checkmark">
                        <div className="tgico tgico-check"/>
                </span>
                <span className="checkbox-label">{label}</span>
            </label>
        </div>
    )
}

export default CheckboxComponent;