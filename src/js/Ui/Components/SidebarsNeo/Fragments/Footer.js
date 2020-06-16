import nodeIf from "../../../../V/VRDOM/jsx/helpers/nodeIf";

function Footer({left, right}, slot) {
    return <div className="footer">
        {nodeIf(<div className="left">{left}</div>, !!left)}
        {nodeIf(<div className="right">{right}</div>, !!right)}
    </div>
}

export default Footer