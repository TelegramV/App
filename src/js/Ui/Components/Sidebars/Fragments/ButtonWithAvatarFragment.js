import AvatarComponent from "../../Basic/AvatarComponent";

export const ButtonWithAvatarFragment = ({peer, name, onClick, blue = false, small = false}, slot) => {
    return (
        <div class={{"button-with-icon button-with-avatar rp": true, blue, small}} onClick={onClick}>
            <AvatarComponent peer={peer}/>
            <div class="button-title">{name}</div>
        </div>
    )
}