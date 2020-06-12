import VCheckbox from "../../../Elements/Input/VCheckbox";
import AvatarComponent from "../../Basic/AvatarComponent";
import PeersStore from "../../../../Api/Store/PeersStore";
import VComponent from "../../../../V/VRDOM/component/VComponent";

export const CheckboxWithPeerFragment = ({peer, onClick, checked = false}) => {
    return (
        <div class={{"checkbox-with-peer rp": true, "selected": checked}} onClick={l => {
            // l.currentTarget.querySelector("input").checked = !l.currentTarget.querySelector("input").checked
            onClick({
                checked: l.currentTarget.querySelector("input").checked
            })
        }}>
            <VCheckbox checked={checked}/>
            <AvatarComponent peer={peer} onClick={null}/>
            <div className="text">
                <div className="name">{peer.name}</div>
                <div className="description">{"last seen a long time ago"}</div>
            </div>
        </div>
    )
}