import CONFIG from "../../configuration"

class DataCenter {
    constructor(options = {}) {
        this.useSsl = options.useSsl
        this.sslSubdomains = ["pluto", "venus", "aurora", "vesta", "flora"]

        this.dcOptions = CONFIG.mtproto.dataCenter.list

        this.chosenServers = {}
    }


    chooseServer(dcID, upload) {
        if (this.chosenServers[dcID] === undefined) {
            let chosenServer = false
            let dcOption
            const path = CONFIG.mtproto.dataCenter.test ? "apiw_test" : "apiw"

            if (this.useSsl) {
                let subdomain = this.sslSubdomains[dcID - 1] + (upload ? "-1" : "")
                chosenServer = `https://${subdomain}.web.telegram.org/${path}`
                return chosenServer
            }

            for (let i = 0; i < this.dcOptions.length; i++) {
                dcOption = this.dcOptions[i]
                if (Number(dcOption.id) === Number(dcID)) {
                    chosenServer = `http://${dcOption.host}:${dcOption.port}/${path}`
                    break
                }
            }

            this.chosenServers[dcID] = chosenServer
        }

        return this.chosenServers[dcID]
    }
}

export default new DataCenter()