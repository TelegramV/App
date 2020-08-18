import AvatarComponent from "../../../../Basic/AvatarComponent";
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer";
import AppSelectedChat from "../../../../../Reactive/SelectedChat";
import Locale from "../../../../../../Api/Localization/Locale"

export const DialogInfoMemberComponent = ({peer}) => {
    return <div className="member rp" onClick={l => AppSelectedChat.select(peer)}>
        <AvatarComponent peer={peer} noSaved/>
        <div className="details">
            <div className="name">{peer.name}</div>
            <div className="status">{Locale.lp(peer.status)}</div>
        </div>
    </div>
}