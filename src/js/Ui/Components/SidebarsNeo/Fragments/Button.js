import nodeIf from "../../../../V/VRDOM/jsx/helpers/nodeIf";
import classIf from "../../../../V/VRDOM/jsx/helpers/classIf";

function Button({text, subtext, description, left, right, onClick, red = false}) {
    return <div className={["button", classIf(!!onClick, "rp"), classIf(red, "red")]} onClick={onClick}>
        {nodeIf(<div className="left">{left}</div>, left)}
        <div className="middle">
            <div className="text">{text}</div>
            {nodeIf(<div className="subtext">{subtext}</div>, subtext)}
            {nodeIf(<div className="description">{description}</div>, description)}
        </div>
        {nodeIf(<div className="right">{right}</div>, right)}
    </div>
}

export default Button