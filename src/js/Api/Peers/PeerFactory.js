import {BotPeer} from "./Objects/BotPeer";
import {UserPeer} from "./Objects/UserPeer";
import {SupergroupPeer} from "./Objects/SupergroupPeer";
import {ChannelPeer} from "./Objects/ChannelPeer";
import {GroupPeer} from "./Objects/GroupPeer";
import {GroupForbiddenPeer} from "./Objects/GroupForbiddenPeer";
import {ChannelForbiddenPeer} from "./Objects/ChannelForbiddenPeer";

class PeerFactory {

    static fromRaw(rawPeer) {
        let type

        if (rawPeer._ === "user") {
            if (rawPeer.bot) {
                type = BotPeer
            } else {
                type = UserPeer
            }
        } else if (rawPeer._ === "channel") {
            if (rawPeer.megagroup) {
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