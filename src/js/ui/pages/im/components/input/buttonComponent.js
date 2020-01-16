export const ButtonWithProgressBarComponent = ({label, id, disabled = false, click}) => {
   return disabled ?
        <button id={id} className="btn rp" disabled onClick={click}>
            <span className="button-text">{label}</span>
            <progress className="progress-circular white"/>
        </button>
    :
        <button id={id} className="btn rp" onClick={click}>
            <span className="button-text">{label}</span>
            <progress className="progress-circular white"/>
        </button>
}