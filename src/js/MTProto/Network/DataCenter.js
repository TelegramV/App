/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
