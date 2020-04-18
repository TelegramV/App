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

import {clear, del, get, keys, set, Store} from "idb-keyval";

// асинхронне, працює і в воркері, і поза ним (правда не певен чи секурне, але пофіг), зберігає що завгодно

const defaultDbName = "telegram-v";
const defaultStoreName = "keval";
const cachedKevals = {};

function createKeval(storeName: string, dbName: string = defaultDbName) {
    if (cachedKevals[storeName]) {
        return cachedKevals[storeName];
    }

    return cachedKevals[storeName] = {
        store: new Store(dbName, storeName),
        keys: function () {
            return keys(this.store);
        },
        deleteItem: function (key) {
            return del(key, this.store);
        },
        getItem: function (key) {
            console.log(this)
            return get(key, this.store);
        },
        clear: function () {
            return clear(this.store);
        },
        setItem: function (key, value) {
            return set(key, value, this.store);
        },
    };
}

const defaultStore = new Store(defaultDbName, defaultStoreName);

const keval = {
    auth: createKeval("authorization"),

    keys: () => keys(defaultStore),
    deleteItem: (key) => del(key, defaultStore),
    getItem: (key) => get(key, defaultStore),
    clear: () => clear(defaultStore),
    setItem: (key, value) => set(key, value, defaultStore),
};

export default keval;