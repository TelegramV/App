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

import AppConfiguration from "../../Config/AppConfiguration"

const names = ["pluto", "venus", "aurora", "vesta", "flora"]
const dc_list = AppConfiguration.mtproto.dataCenter.list
const chosen_servers = {}

/**
 * @param {number} dcId
 * @param upload
 * @return {string|*}
 */
function chooseServer(dcId, upload = false) {
    if (chosen_servers[dcId] === undefined) {
        let chosenServer = false
        const path = AppConfiguration.mtproto.dataCenter.test ? "apiws_test" : "apiws"

        if (dcId !== 0) {
            let subdomain = names[dcId - 1] + (upload ? "-1" : "")
            chosenServer = `wss://${subdomain}.web.telegram.org/${path}`
            return chosenServer
        }

        for (let i = 0; i < dc_list.length; i++) {
            let dcOption = dc_list[i]
            if (dcOption.id === dcId) {
                chosenServer = `ws://${dcOption.host}:${dcOption.port}/${path}`
                break
            }
        }

        chosen_servers[dcId] = chosenServer;
    }

    return chosen_servers[dcId]
}

const DataCenter = {
    chooseServer: chooseServer
}

export default DataCenter
