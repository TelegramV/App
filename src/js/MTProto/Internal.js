// NEVER USE THIS THING OUTSIDE mtproto FOLDER

import TelegramApplication from "./TelegramApplication";

// NEVER USE THIS THING OUTSIDE mtproto FOLDER

export const MTProtoInternal = {
    application: new TelegramApplication(),
    updatesHandler: () => console.error("no updates handler"),
    workerPostMessage: () => console.error("fuck we are in a very bad situation"),

    syncTimeWithFrontend() {
        this.workerPostMessage({
            type: "syncTime"
        })
    },
    connectionRestored() {
        this.workerPostMessage({
            type: "connectionRestored"
        });
    },
    connectionLost() {
        this.workerPostMessage({
            type: "connectionLost"
        });
    },
    processUpdate(update) {
        this.updatesHandler(update);
    },
    connect() {
        return this.application.start();
    },
    invokeMethod(method, params = {}, dcId = null, useSecondTransporter) {
        return this.application.invokeMethod(method, params, {
            dcId,
            useSecondTransporter
        });
    },
};

// NEVER USE THIS THING OUTSIDE mtproto FOLDER

export default MTProtoInternal
