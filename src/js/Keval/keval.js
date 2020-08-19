import {openDB} from "idb";

const defaultDbName = "telegram-v";
const defaultStoreName = "keval";
const cachedKevals = {};

export function useKeval(dbPromise, storeName: string) {
    if (cachedKevals[storeName]) {
        return cachedKevals[storeName];
    }

    return cachedKevals[storeName] = {
        keys: () => dbPromise.then(db => db.getAllKeys(storeName)),
        clear: () => dbPromise.then(db => db.clear(storeName)),
        deleteItem: (key) => dbPromise.then(db => db.delete(storeName, key)),
        getItem: (key) => dbPromise.then(db => db.get(storeName, key)),
        setItem: (key, val) => dbPromise.then(db => db.put(storeName, val, key)),
    };
}

const DEFAULT_DB_PROMISE = openDB(defaultDbName, 2, {
    upgrade(db, oldVersion, newVersion, transaction) {
            db.createObjectStore(defaultStoreName);
            db.createObjectStore("authorization");
            db.createObjectStore("localization");
    },
});

const keval = {
    auth: useKeval(DEFAULT_DB_PROMISE, "authorization"),
    lang: useKeval(DEFAULT_DB_PROMISE, "localization"),

    keys: () => DEFAULT_DB_PROMISE.then(db => db.getAllKeys(defaultStoreName)),
    clear: () => DEFAULT_DB_PROMISE.then(db => db.clear(defaultStoreName)),
    deleteItem: (key) => DEFAULT_DB_PROMISE.then(db => db.delete(defaultStoreName, key)),
    getItem: (key) => DEFAULT_DB_PROMISE.then(db => db.get(defaultStoreName, key)),
    setItem: (key, val) => DEFAULT_DB_PROMISE.then(db => db.put(defaultStoreName, val, key)),
};

export default keval;