const RadioComponent = ({ label = "", checked, name, input }) => {
    return (
        <div className="radio-input">
        	<label onInput={input}>
        		<input type="radio" name={name} checked={checked? true : undefined}/>
                {label?<span className="radio-label">{label}</span>: ""}
            </label>
        </div>
    )
}

export default RadioComponent;