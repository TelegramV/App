import classIf from "../../../../V/VRDOM/jsx/helpers/classIf";

function FloatingActionButton({icon, hidden, onClick}) {
    return <div className={["floating-action-button rp", classIf(hidden, "hidden")]} onClick={onClick}>
        <i className={"tgico tgico-" + icon}/>
    </div>
}

export default FloatingActionButton