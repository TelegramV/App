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
            dcId = this.mainDcId,
            useSecondTransporter = false,
        } = options;

        if (!dcId) {
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