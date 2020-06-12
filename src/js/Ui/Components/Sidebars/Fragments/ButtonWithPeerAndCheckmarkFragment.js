import VCheckbox from "../../../Elements/Input/VCheckbox";
import AvatarComponent from "../../Basic/AvatarComponent";

export const ButtonWithPeerAndCheckmarkFragment = ({peer, onClick, blue = false, small = false, checked = false}, slot) => {
    return (
        <div class={{"button-with-icon button-with-avatar and-checkmark rp": true, blue, small}} onClick={onClick}>
            <AvatarComponent peer={peer}/>
            <div class="button-title">{peer.name}</div>
            <VCheckbox checked={checked} circle/>
        </div>
    )
}