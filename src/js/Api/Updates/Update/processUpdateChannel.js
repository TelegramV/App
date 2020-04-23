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

import AppEvents from "../../EventBus/AppEvents"
import DialogsManager from "../../Dialogs/DialogsManager"

const processUpdateChannel = update => {
    DialogsManager.getPeerDialogs(update.__peer).then(dialogs => {
        if (dialogs.length === 0) {
            AppEvents.Dialogs.fire("hideDialogByPeer", {
                peer: update.__peer
            })
        } else {
            if (dialogs[0].peer.isLeft) {
                AppEvents.Dialogs.fire("hideDialogByPeer", {
                    peer: update.__peer
                })
            } else {
                AppEvents.Dialogs.fire("gotNewMany", {
                    dialogs
                })
            }
        }
    })
}

export default processUpdateChannel