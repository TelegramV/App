export const ButtonWithIconFragment = ({icon, name, onClick, blue = false, small = false}, slot) => {
    let iconClasses = ["button-icon", "tgico", "tgico-" + icon]
    return (
        <div class={{"button-with-icon rp": true, blue, small}} onClick={onClick}>
            {icon ? <i class={iconClasses}/> : slot}
            <div class="button-title">{name}</div>
        </div>
    )
}