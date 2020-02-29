import AvatarComponent from "../../../../Basic/AvatarComponent";
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer";

export const DialogInfoMemberComponent = ({peer}) => {
    return <div className="member rp" onClick={l => AppSelectedInfoPeer.select(peer)}>
        <AvatarComponent peer={peer}/>
        <div className="details">
            <div className="name">{peer.name}</div>
            <div className={["status", peer.statusString.online ? "online" : ""]}>{peer.statusString.text}</div>
        </div>
    </div>
}