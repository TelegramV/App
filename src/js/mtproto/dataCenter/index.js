class DataCenter {
    constructor(options = {}) {
        this.useSsl = options.useSsl
        this.sslSubdomains = ["pluto", "venus", "aurora", "vesta", "flora"]

        this.dcOptions = [
            {id: 0, host: "149.154.167.40", port: 80},
            {id: 1, host: "149.154.175.50", port: 80},
            {id: 2, host: "149.154.167.51", port: 80},
            {id: 3, host: "149.154.175.100", port: 80},
            {id: 4, host: "149.154.167.91", port: 80},
            {id: 5, host: "149.154.171.5", port: 80}
        ]

        this.chosenServers = {}
    }


    chooseServer(dcID, upload) {
        if (this.chosenServers[dcID] === undefined) {
            let chosenServer = false
            let dcOption

            if (this.useSsl) {
                let subdomain = this.sslSubdomains[dcID - 1] + (upload ? "-1" : "")
                const path = "apiw1_test"
                chosenServer = "https://" + subdomain + ".web.telegram.org/" + path
                return chosenServer
            }

            for (let i = 0; i < this.dcOptions.length; i++) {
                dcOption = this.dcOptions[i]
                if (Number(dcOption.id) === Number(dcID)) {
                    chosenServer = "http://" + dcOption.host + (Number(dcOption.port) !== 80 ? ":" + dcOption.port : "") + "/apiw1_test"
                    break
                }
            }

            this.chosenServers[dcID] = chosenServer
        }

        return this.chosenServers[dcID]
    }
}

export default new DataCenter()