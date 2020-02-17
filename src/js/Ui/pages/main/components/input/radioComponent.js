const RadioComponent = ({ label = "", checked, name, input }) => {
    return (
        <div className="radio-input">
        	<label>
        		<input type="radio" name={name} onInput={input} checked={checked? true : undefined}/>
                {label?<span className="radio-label">{label}</span>: ""}
            </label>
        </div>
    )
}

export default RadioComponent;