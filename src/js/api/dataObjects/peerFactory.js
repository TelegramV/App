import {BotPeer} from "./peer/botPeer";
import {UserPeer} from "./peer/userPeer";
import {SupergroupPeer} from "./peer/supergroupPeer";
import {ChannelPeer} from "./peer/channelPeer";
import {GroupPeer} from "./peer/groupPeer";
import {GroupForbiddenPeer} from "./peer/groupForbiddenPeer";
import {ChannelForbiddenPeer} from "./peer/channelForbiddenPeer";

class PeerFactory {
    static fromRaw(rawPeer) {
        let type

        if (rawPeer._ === "user") {
            if (rawPeer.pFlags.bot) {
                type = BotPeer
            } else {
                type = UserPeer
            }
        } else if (rawPeer._ === "channel") {
            if (rawPeer.pFlags.megagroup) {
                type = SupergroupPeer
            } else {
                type = ChannelPeer
            }
        } else if (rawPeer._ === "chat") {
            type = GroupPeer
        } else if (rawPeer._ === "chatForbidden") {
            type = GroupForbiddenPeer
        } else if (rawPeer._ === "channelForbidden") {
            type = ChannelForbiddenPeer
        }

        return new (type)(rawPeer)
    }
}

export default PeerFactory