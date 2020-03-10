export const AppConfiguration = {
    mtproto: {
        dataCenter: {
            default: 2,
            test: false,
            list: [
                { id: 0, host: "149.154.167.40", port: 80 }, // test server
                { id: 1, host: "149.154.175.50", port: 80 },
                { id: 2, host: "149.154.167.51", port: 80 },
                { id: 3, host: "149.154.175.100", port: 80 },
                { id: 4, host: "149.154.167.91", port: 80 },
                { id: 5, host: "149.154.171.5", port: 80 },
            ],
        },
        api: {
            invokeWithoutUpdates: 0xbf9459b7,
            invokeWithLayer: 0xda9b0d0d,
            layer: 109,
            initConnection: 0xc7481da6,
            api_id: 1147988,
            api_hash: "4acddf30a6113bfe220f7fd67ab7f468",
            app_version: "0.2.0",
        },
    },
    calls: {
        protocolVersion: 9,
        minProtocolVersion: 9,
        protocolName: 0x50567247,

    },
    get useNativeBigInt() {
        // return BigInt || false
        return false;
    },
};

export default AppConfiguration;
