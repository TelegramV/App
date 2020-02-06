import {BotPeer} from "./objects/BotPeer";
import {UserPeer} from "./objects/UserPeer";
import {SupergroupPeer} from "./objects/SupergroupPeer";
import {ChannelPeer} from "./objects/ChannelPeer";
import {GroupPeer} from "./objects/GroupPeer";
import {GroupForbiddenPeer} from "./objects/GroupForbiddenPeer";
import {ChannelForbiddenPeer} from "./objects/ChannelForbiddenPeer";

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