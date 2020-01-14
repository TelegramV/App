import MappedStore from "./MappedStore"

class DialogsMapStore extends MappedStore {
    constructor() {
        super({
            initialData: new Map([
                ["chat", new Map()],
                ["channel", new Map()],
                ["user", new Map()],
            ])
        });
    }

    /**
     * @return {Map<string, Map<number, Dialog>>}
     */
    get data() {
        return super.data
    }

    /**
     * @param {string} type
     * @param {number} id
     * @return {Dialog|boolean}
     */
    get(type, id) {
        if (this.data.has(type)) {
            return this.data.get(type).get(id) || false
        } else {
            return false
        }
    }

    /**
     * @param {Dialog} dialog
     * @return {this}
     */
    set(dialog) {
        // todo: make this check
        // if (dialog instanceof Dialog) {
        if (this.data.has(dialog.type)) {
            this.data.get(dialog.type).set(dialog.id, dialog)
            return this
        } else {
            console.error("invalid dialog type")
            return this
        }
        // } else {
        //     console.error("the given dialog is not Dialog instance")
        // }
    }

    /**
     * @param {Array<Dialog>} dialogs
     * @return {this}
     */
    setMany(dialogs) {
        for (const dialog of dialogs) {
            this.set(dialog)
        }

        return this
    }

    /**
     * @param {string} username
     * @return {Dialog|false}
     */
    getByUsername(username) {
        return this.find(dialog => dialog.peer.username === username)
    }

    /**
     * @param {function(dialog: Dialog): boolean} predicate
     * @return {Dialog|boolean}
     */
    find(predicate) {
        for (const [_, data] of this.data.entries()) {
            for (const [_, dialog] of data.entries()) {
                if (predicate(dialog)) {
                    return dialog
                }
            }
        }

        return false
    }

    /**
     * @param {string} type
     * @param {function(dialog: Dialog): boolean} predicate
     * @return {Dialog|boolean}
     */
    findWithType(type, predicate) {
        if (this.data.has(type)) {
            for (const [_, dialog] of this.data.get(type).entries()) {
                if (predicate(dialog)) {
                    return dialog
                }
            }
        } else {
            console.error("invalid dialog type")
        }

        return false
    }

    /**
     * @param {string} type
     * @param {number} id
     * @return {boolean}
     */
    has(type, id) {
        return this.data.get(type).has(id)
    }
}

const DialogsStore = new DialogsMapStore()

export default DialogsStore