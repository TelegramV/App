import classIf from "../../../../V/VRDOM/jsx/helpers/classIf";

function FloatingActionButton({icon, hidden, fixed, onClick}) {
    return <div className={["floating-action-button rp", classIf(hidden, "hidden"), classIf(fixed, "fixed")]} onClick={onClick}>
        <i className={"tgico tgico-" + icon}/>
    </div>
}

export default FloatingActionButton