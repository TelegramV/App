const CheckboxComponent = ({ label = "", checked, input }) => {
    return (
        <div className="checkbox-input">
        	<label onInput={input}>
        		<input type="checkbox" checked={checked? true : undefined}/>
                <span className="checkmark">
                    <span className="tgico tgico-check"/>
                </span>
                {label?<span className="checkbox-label">{label}</span>:""}
            </label>
        </div>
    )
}

export default CheckboxComponent;