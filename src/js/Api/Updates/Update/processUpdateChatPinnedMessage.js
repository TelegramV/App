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
import {GroupPeer} from "../../Peers/Objects/GroupPeer"

function processUpdateChatPinnedMessage(update) {
    const peer = PeersStore.get("chat", update.chat_id)

    if (peer instanceof GroupPeer) {
        peer.pinnedMessageId = update.id
    }
}

export default processUpdateChatPinnedMessage