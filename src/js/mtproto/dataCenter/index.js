import AppConfiguration from "../../configuration"

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
    chooseServer
}

export default DataCenter
