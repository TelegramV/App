import {BotPeer} from "./peer/botPeer";
import {UserPeer} from "./peer/userPeer";
import {SupergroupPeer} from "./peer/supergroupPeer";
import {ChannelPeer} from "./peer/channelPeer";
import {GroupPeer} from "./peer/groupPeer";
import {createLogger} from "../common/logger";
import {GroupForbiddenPeer} from "./peer/groupForbiddenPeer";
import {ChannelForbiddenPeer} from "./peer/channelForbiddenPeer";

const Logger = createLogger("PeerFactory")

export function getPeerObject(peer) {
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
    return new (type)(peer)
}