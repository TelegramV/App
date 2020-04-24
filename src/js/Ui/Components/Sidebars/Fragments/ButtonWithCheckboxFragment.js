import VCheckbox from "../../Elements/VCheckbox";

export const ButtonWithCheckboxFragment = ({name, onClick, checked = false}) => {
    return (
        <div class="button-with-icon rp" onClick={onClick}>
            <VCheckbox checked={checked}/>
            <div class="button-title">{name}</div>
        </div>
    )
}