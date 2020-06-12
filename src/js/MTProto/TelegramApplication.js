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

import Connection from "./Network/Connection";

const FILE_CONNECTION_METHODS = [
    "upload.getFile",
    "upload.getFileHashes",
    "upload.getWebFile",
    "messages.getDocumentByHash",
    "photos.uploadProfilePhoto",
    "upload.saveFilePart",
    "upload.saveBigFilePart",
];

class TelegramApplication {
    mainDcId: number;

    user: any;

    connections: Map<number, Connection>;

    constructor() {
        this.mainDcId = 2;
        this.connections = new Map();
        this.awaitingInvokes = [];
        this._isReady = false;
    }

    get mainConnection() {
        return this.connections.get(this.mainDcId);
    }

    get isReady() {
        return this._isReady && this.mainConnection;
    }

    async isSignedIn() {
        if (this.user) {
            return true;
        }

        try {
            return this.user = await this.mainConnection.invokeMethod("users.getUsers", {
                id: [
                    {
                        _: "inputUserSelf"
                    }
                ]
            });
        } catch (e) {
            console.log("user is not logged in");
            return false;
        }
    }

    async start(): Promise<any> {
        if (this.isReady) {
            console.warn("already started, ignoring")
            return Promise.reject();
        }

        this.connections.set(this.mainDcId, new Connection(this.mainDcId, true, this));

        this.mainConnection.init({
            doPinging: true,
        });

        try {
            this.user = await this.mainConnection.invokeMethod("users.getUsers", {
                id: [
                    {
                        _: "inputUserSelf"
                    }
                ]
            });
            console.log("logged in");
        } catch (e) {
            console.log("user is not logged in");
        }

        this._isReady = true;

        this.resolveAwaiting();

        return this.user;
    }

    invokeMethod<P = any, R = any>(name: string, params: P = {}, options: { dcId?: number, useSecondTransporter?: boolean; } = {}): Promise<R> {
        let {
            dcId,
            useSecondTransporter = false,
        } = options;

        if (dcId == null) {
            dcId = this.mainDcId;
        }

        if (!useSecondTransporter) {
            useSecondTransporter = FILE_CONNECTION_METHODS.includes(name);
        }

        if (!this.isReady) {
            return new Promise((resolve, reject) => {
                this.awaitingInvokes.push({
                    name, params, resolve, reject, dcId, useSecondTransporter
                })
            });
        }

        let connection = this.connections.get(dcId);

        if (!connection) {
            connection = new Connection(dcId, false, this);
            this.connections.set(dcId, connection);
            connection.init({
                doPinging: false,
            });
        }

        return connection.invokeMethod(name, params, {useSecondTransporter: useSecondTransporter});
    }

    resolveAwaiting() {
        if (this.isReady) {
            this.awaitingInvokes.forEach(i => {
                const {name, params, resolve, reject, dcId, useSecondTransporter} = i;

                this.invokeMethod(name, params, {dcId, useSecondTransporter})
                    .then(resolve)
                    .catch(reject);
            });
            this.awaitingInvokes = [];
        }
    }
}

export default TelegramApplication;