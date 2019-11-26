import {BotPeer} from "./botPeer";
import {UserPeer} from "./userPeer";
import {SupergroupPeer} from "./supergroupPeer";
import {ChannelPeer} from "./channelPeer";
import {GroupPeer} from "./groupPeer";
import {createLogger} from "../common/logger";
import {GroupForbiddenPeer} from "./groupForbiddenPeer";
import {ChannelForbiddenPeer} from "./channelForbiddenPeer";

const Logger = createLogger("PeerFactory")

export function getPeerObject(peer, messageId = null) {
    let type
    if(peer._ === "user") {
        if(peer.pFlags.bot) {
            type = BotPeer
        } else {
            type = UserPeer
        }
    } else if(peer._ === "channel") {
        if(peer.pFlags.megagroup) {
            type = SupergroupPeer
        } else {
            type = ChannelPeer
        }
    } else if(peer._ === "chat") {
        type = GroupPeer
    } else if(peer._ === "chatForbidden") {
        type = GroupForbiddenPeer
    } else if(peer._ === "channelForbidden") {
        type = ChannelForbiddenPeer
    }
    // If there's no pFlags it's probably chat
    if(peer.pFlags && peer.pFlags.min && !messageId) {
        // https://core.telegram.org/api/min
        console.error(peer, messageId)
        throw new Error("Tried to create min peer without message context")
    }
    const p = new (type)(peer)
    p.contextMessageId = messageId
    return p
}