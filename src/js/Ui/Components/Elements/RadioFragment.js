import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf"

const RadioFragment = ({label = "", checked, name, input}) => {
    return (
        <div className="radio-input">
            <label>
                <input type="radio" name={name} onInput={input} checked={checked ? true : undefined}/>
                {nodeIf(<span className="radio-label">{label}</span>, label)}
            </label>
        </div>
    )
}

export default RadioFragment;