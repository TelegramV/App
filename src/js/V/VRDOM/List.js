/**
 * (c) Telegram V
 */

class VCollection {

    changeSubscribers: Set = new Set()

    push(item) {

    }

    prepend(item) {

    }

    clear() {

    }

    delete(item) {

    }

    get items() {
        return null
    }
}

export class VSet extends VCollection {

    prepended: Set
    set: Set

    constructor(items = []) {
        super()

        this.prepended = new Set()
        this.set = new Set(items)
    }

    push(item) {
        this.set.add(item)
        this.changeSubscribers.forEach(s => s("push", item))
    }

    prepend(item) {
        this.prepended.add(item)
        this.changeSubscribers.forEach(s => s("prepend", item))
    }

    clear() {
        this.prepended.clear()
        this.changeSubscribers.forEach(s => s("clear"))
    }

    delete(item) {
        this.prepended.delete(item)
        this.changeSubscribers.forEach(s => s("delete", item))
    }

    get items() {
        return [...this.prepended].concat([...this.set])
    }
}

export class List {

    list: VCollection
    template: Function

    $parent: HTMLElement

    $associated: Map

    $first: HTMLElement
    $last: HTMLElement

    constructor(props) {
        this.list = props.list
        this.list.changeSubscribers.add(this.onArrayChange)
        this.template = props.template

        this.$associated = new Map()

        if (typeof this.template !== "function") {
            throw new Error("only functions are allowed")
        }
    }

    render() {
        return this.list.items.map(item => {
            return this.template({}, item)
        })
    }

    onArrayChange = (type, item) => {
        if (type === "push") {
            const $appended = VRDOM.append(this.template(item), this.$parent)
            this.$associated.set(item, $appended)
        } else if (type === "prepend") {
            const $prepended = VRDOM.prepend(this.template(item), this.$parent)
            this.$associated.set(item, $prepended)
        } else if (type === "clear") {
            VRDOM.deleteInner(this.$parent)
            this.$associated.clear()
        } else if (type === "delete") {
            this.$associated.get(item).remove()
        }
    }
}