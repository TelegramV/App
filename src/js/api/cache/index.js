class Cache {
    constructor() {

        /**
         * @type {undefined}
         * @private
         */
        this._db = undefined
        this._dbName = "cache"
        this._dbVersion = 1
        this._dbReady = false
        this._dbReadyListeners = new Set()

        this._sectorNames = new Set([
            "peerAvatars",
            "images",
            "files",
            "languages",
            "schema"
        ])
    }

    /**
     * @return {boolean}
     */
    get isReady() {
        return this._db && this._dbReady
    }

    /**
     * @param {function} callback
     */
    onReady(callback) {
        this._dbReadyListeners.add(callback)
    }

    /**
     * Opens IndexedDB
     */
    open() {
        let request = indexedDB.open(this._dbName, this._dbVersion)

        request.onerror = e => {
            console.error("error opening db", e)
        }

        request.onsuccess = e => {
            console.log("db opened")

            this._db = e.target.result
            this._dbReady = true

            this._dbReadyListeners.forEach(listener => {
                listener()
            })
        }

        request.onupgradeneeded = e => {
            console.warn("db upgrading")

            let db = e.target.result

            this._sectorNames.forEach(sectorName => {
                console.log("creating object store", sectorName)
                db.createObjectStore(sectorName, {
                    autoIncrement: false
                })
            })
        }
    }

    transaction(sectorName, access = "readwrite") {
        return this._db.transaction([sectorName], access)
    }

    get(sectorName, key) {
        return new Promise((resolve, reject) => {
            if (!this.isReady) {
                reject("db is not ready")
            }

            const transaction = this.transaction(sectorName, "readonly")

            const objectStore = transaction.objectStore(sectorName)
            const request = objectStore.get(key)

            request.onsuccess = e => {
                resolve(e.target.result)
            }

            request.onerror = e => {
                reject(e)
            }
        })
    }

    put(sectorName, key, value) {
        return new Promise((resolve, reject) => {
            if (!this.isReady) {
                return reject("db is not ready")
            }

            const transaction = this.transaction(sectorName, "readwrite")

            const objectStore = transaction.objectStore(sectorName)
            const request = objectStore.put(value, key)

            request.onsuccess = e => {
                resolve(e)
            }

            request.onerror = e => {
                reject(e)
            }
        })
    }
}

const AppCache = new Cache()

export default AppCache