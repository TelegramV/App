function ButtonWithIconAndDescriptionFragment({icon, name, description = null, onClick}, slot) {
    return (
        <div class="button-with-icon and-description rp" onClick={onClick}>
            {icon ? <i class={["button-icon", "tgico", "tgico-" + icon]}/> : slot}
            <div class="button-title">{name}</div>
            <div className="button-description">{description}</div>
        </div>
    )
}

export default ButtonWithIconAndDescriptionFragment;