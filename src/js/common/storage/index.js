const data = {}

class Storage {
    constructor() {
        this.data = data
    }

    get(key, defaultValue = null) {
        return new Promise(resolve => {
            const value = this.data[key]
            resolve(value !== undefined && value != null ? value : defaultValue)
        })
    }

    set(key, value) {
        this.data[key] = value
        return value
    }

    exists(key) {
        return data[key] !== undefined && data[key] != null
    }
}

export default new Storage()