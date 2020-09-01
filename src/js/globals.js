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

import {FileAPI} from "./Api/Files/FileAPI";
import registerServiceWorker, {ServiceWorkerNoSupportError} from "service-worker-loader!../js/Api/downloadServiceWorker";

global.$ = require("./Ui/Utils/$").default;
global.VRDOM = require("./V/VRDOM/VRDOM").default;

global.__IS_PRODUCTION__ = __IS_PRODUCTION__;
global.__IS_DEV__ = __IS_DEV__;
global.__IS_SAFARI__ = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
global.__IS_IOS__ = !!navigator.platform.match(/iPhone|iPod|iPad/);
global.__DOCUMENTS__ = new Map();

registerServiceWorker({scope: "/"}).then((registration: ServiceWorkerRegistration) => {
    console.log("Success!");
    console.log(registration, navigator.serviceWorker.controller);

    navigator.serviceWorker.addEventListener("message", (e: MessageEvent) => {
        // console.log("FROM SW", e);

        if (e.data.taskId) {
            const {taskId, fileId, start, end} = e.data;
            const document = global.__DOCUMENTS__.get(fileId);

            // console.log(fileId, document);

            FileAPI.downloadDocumentPart(document, null, end - start, start)
                .then(({bytes}) => {
                    navigator.serviceWorker.controller.postMessage({
                        taskId: e.data.taskId,
                        result: {
                            bytes,
                            documentSize: document.size,
                            mimeType: document.mime_type,
                        },
                    });
                });
        }
    });
}).catch((err) => {

    if (err instanceof ServiceWorkerNoSupportError) {
        console.log("Service worker is not supported.");
    } else {
        console.log("Error!");
    }
});