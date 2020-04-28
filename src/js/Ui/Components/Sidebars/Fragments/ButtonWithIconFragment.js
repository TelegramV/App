export const ButtonWithIconFragment = ({icon, name, onClick}, slot) => {
    let iconClasses = ["button-icon", "tgico", "tgico-" + icon]
    return (
        <div class="button-with-icon rp" onClick={onClick}>
            {icon ? <i class={iconClasses}/> : slot}
            <div class="button-title">{name}</div>
        </div>
    )
}