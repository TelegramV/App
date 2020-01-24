import {BotPeer} from "./peer/BotPeer";
import {UserPeer} from "./peer/UserPeer";
import {SupergroupPeer} from "./peer/SupergroupPeer";
import {ChannelPeer} from "./peer/ChannelPeer";
import {GroupPeer} from "./peer/GroupPeer";
import {GroupForbiddenPeer} from "./peer/GroupForbiddenPeer";
import {ChannelForbiddenPeer} from "./peer/ChannelForbiddenPeer";

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