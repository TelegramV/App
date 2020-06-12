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

import type {VRNodeProps, VRTagName} from "./types/types"
import VRNode from "./VRNode"
import VListVRNode from "./list/VListVRNode"
import vrdom_isTagNameList from "./is/isTagNameList"
import ComponentVRNode from "./component/ComponentVRNode"
import VComponent from "./component/VComponent"

/**
 * @param tagName
 * @param props
 */
function vrdom_createNode(tagName: VRTagName, props: VRNodeProps): VRNode {
    if (typeof tagName === "function") {

        if (tagName.prototype instanceof VComponent) {

            // console.debug("[createElement] creating acomp node")

            return new ComponentVRNode(tagName, {
                attrs: props.attrs,
                ref: props.ref
            }, props.children)

        } else if (vrdom_isTagNameList(tagName)) {

            // console.debug("[createElement] creating list node")

            return new VListVRNode(tagName, props.attrs)

        } else {
            if (props.ref && props.ref.__fragment_ref) {
                props.ref.slot = props.children.length > 0 ? props.children : undefined
                props.ref.props = props.attrs

                if (props.ref.fragment) {
                    return props.ref.fragment({
                        ...props.attrs,
                    }, props.children)
                } else {
                    props.ref.fragment = tagName

                    const node = tagName({
                        ...props.attrs,
                    }, props.children)
                    node.ref = props.ref

                    return node
                }
            } else {

                return tagName({
                    ...props.attrs,
                }, props.children)

            }

        }
    }

    return new VRNode(tagName, props)
}

export default vrdom_createNode;