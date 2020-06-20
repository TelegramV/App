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

// NEVER USE THIS THING OUTSIDE mtproto FOLDER

import TelegramApplication from "./TelegramApplication";

// NEVER USE THIS THING OUTSIDE mtproto FOLDER

export const MTProtoInternal = {
    application: new TelegramApplication(),
    updatesHandler: () => console.error("no updates handler"),
    workerPostMessage: () => console.error("this is a very bad situation"),

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
