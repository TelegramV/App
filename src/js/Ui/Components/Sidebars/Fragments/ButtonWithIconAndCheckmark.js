import VCheckbox from "../../Elements/VCheckbox";

export const ButtonWithIconAndCheckmarkFragment = ({icon, name, onClick, blue = false, small = false, checked = false}, slot) => {
    let iconClasses = ["button-icon", "tgico", "tgico-" + icon]
    return (
        <div class={{"button-with-icon and-checkmark rp": true, blue, small}} onClick={onClick}>
            {icon ? <i class={iconClasses}/> : slot}
            <div class="button-title">{name}</div>
            <VCheckbox checked={checked} circle/>
        </div>
    )
}