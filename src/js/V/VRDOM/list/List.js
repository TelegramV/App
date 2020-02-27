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

import VCollection from "./VCollection"
import VF from "../../VFramework"
import vrdom_delete from "../delete"

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
            this.__refresh()
        }
    }

    __destroy = () => {

    }

    __update = ({list}) => {
        if (list !== this.list) {
            this.list.mutationSubscribers.delete(this.onArrayChange)
            this.list = list
            this.list.mutationSubscribers.add(this.onArrayChange)
            this.__refresh()
        }
    }

    __mount = ($parent) => {
        this.$el = $parent
        this.$el.__list = this
        VF.mountedComponents.set(this.identifier, this)
    }

    __unmount = () => {
        this.list.mutationSubscribers.delete(this.onArrayChange)
        this.$el.__v.list = undefined
        this.$el = undefined
        this.childNodes = undefined
        this.backChildNodes = undefined
        this.list = undefined
        this.template = undefined
        VF.mountedComponents.delete(this.identifier)
    }

    __refresh = () => {
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