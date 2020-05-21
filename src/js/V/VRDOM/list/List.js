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

import VCollection from "./VCollection"
import vrdom_delete from "../delete"
import VApp from "../../vapp"

class List {

    __ = {
        isRefreshingItSelf: false
    }

    identifier: string

    list: VCollection
    template: Function

    $el: HTMLElement

    childNodes: Array = []
    backChildNodes: Array = []

    constructor(props) {
        this.list = props.list
        this.list.mutationSubscribers.add(this.onArrayChange)
        this.template = props.template

        if (typeof this.template !== "function") {
            throw new Error("only functions are allowed")
        }
    }

    render = () => {
        return this.list.items.map((item, index) => {
            return this.template(item, this.list, index)
        })
    }

    onArrayChange = (type, props) => {
        if (type === VCollection.ADD) {
            const $node = VRDOM.append(this.template(props.item, this.list, props.key), this.$el)
            this.childNodes.push($node)
        } else if (type === VCollection.ADD_BACK) {
            const $node = VRDOM.prepend(this.template(props.item, this.list, props.key), this.$el)
            this.backChildNodes.push($node)
        } else if (type === VCollection.CLEAR) {
            VRDOM.deleteInner(this.$el)
        } else if (type === VCollection.DELETE) {
            if (props.key < 0) {
                props.key = props.key * -1 - 1
                if (this.backChildNodes[props.key]) {
                    vrdom_delete(this.backChildNodes[props.key])
                    delete this.backChildNodes[props.key]
                }
            } else {
                if (this.childNodes[props.key]) {
                    vrdom_delete(this.childNodes[props.key])
                    delete this.childNodes[props.key]
                }
            }
        } else if (type === VCollection.SET) {
            // console.warn("set", this)
            this.__refresh()
        }
    }

    __destroy = () => {

    }

    __update = ({list}) => {
        // console.warn("updating")
        if (list !== this.list) {
            // console.warn("updating in")

            this.list.mutationSubscribers.delete(this.onArrayChange)
            this.list = list
            this.list.mutationSubscribers.add(this.onArrayChange)
            this.__refresh()
        }
    }

    __mount = ($parent) => {
        this.$el = $parent
        this.$el.__list = this
        VApp.mountedComponents.set(this.identifier, this)
    }

    __unmount = () => {
        this.list.mutationSubscribers.delete(this.onArrayChange)
        this.$el.__v.list = undefined
        this.$el = undefined
        this.childNodes = undefined
        this.backChildNodes = undefined
        this.list = undefined
        this.template = undefined
        VApp.mountedComponents.delete(this.identifier)
    }

    __refresh = () => {
        // console.warn("refreshing")
        this.__.isRefreshingItSelf = true
        this.childNodes = []
        this.backChildNodes = []
        const children = this.render()
        VRDOM.patchChildren(this.$el, {children})
        children.forEach((item, index) => {
            this.childNodes.push(this.$el.childNodes[index])
        })
        this.__.isRefreshingItSelf = false
    }
}

export default List