import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf"
import valIf from "../../../V/VRDOM/jsx/helpers/valIf"

function VRadio(
    {
        label,
        checked,
        name,
        input
    }
) {
    return (
        <div className="radio-input">
            <label>
                <input type="radio"
                       name={name}
                       onInput={input}
                       checked={valIf(checked, true)}/>

                {nodeIf(<span className="radio-label">{label}</span>, label)}
            </label>
        </div>
    )
}

export default VRadio;