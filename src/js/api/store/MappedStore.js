import {Publisher} from "../eventBus/Publisher"

/**
 * Simple Store class
 *
 * @property {Map} _data
 */
export default class MappedStore extends Publisher {
    constructor(props) {
        super()

        if (props.initialData) {
            if (props.initialData instanceof Map) {
                this._data = props.initialData
            } else {
                throw new Error("initialData must be of Map type")
            }
        } else {
            this._data = new Map()
        }
    }

    /**
     * @return {Map|Map<any, any>|Map<string, any>}
     */
    get data() {
        return this._data
    }

    /**
     * @param key
     * @param value
     * @return {this}
     */
    set(key, value) {
        this.data.set(key, value)
        return this
    }

    /**
     * @param key
     * @return {*}
     */
    get(key) {
        return this.data.get(key)
    }

    /**
     * @param key
     * @return {boolean}
     */
    has(key) {
        return this.data.has(key)
    }

    /**
     * @param key
     * @return {boolean}
     */
    delete(key) {
        return this.data.delete(key)
    }

    /**
     * @param subscription
     */
    onSet(subscription) {
        this.subscribe(subscription)
    }
}