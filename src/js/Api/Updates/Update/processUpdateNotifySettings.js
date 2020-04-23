/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import PeersStore from "../../Store/PeersStore"

function processUpdateNotifySettings(update) {
    if (update.peer._ === "notifyPeer") {
        let peer
        if (update.peer.peer._ === "peerUser") {
            peer = PeersStore.get("user", update.peer.peer.user_id)
        } else if (update.peer.peer._ === "peerChat") {
            peer = PeersStore.get("chat", update.peer.peer.chat_id)
        } else if (update.peer.peer._ === "peerChannel") {
            peer = PeersStore.get("channel", update.peer.peer.channel_id)
        }

        if (peer && peer.full) {
            peer.full.notify_settings = update.notify_settings
            peer.fire("updateNotificationStatus", {
                notifySettings: update.notify_settings
            })
        }
    }
}

export default processUpdateNotifySettings