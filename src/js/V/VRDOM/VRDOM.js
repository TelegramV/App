/*
 * Telegram V
 * Copyright (C) 2020 Davyd Kohut
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

import vrdom_createElement from "./createElement"
import vrdom_createNode from "./createNode"
import vrdom_render from "./render/render"
import vrdom_mount from "./mount"
import vrdom_delete from "./delete"
import vrdom_patch from "./patch/patch"
import vrdom_append from "./append"
import vrdom_prepend from "./prepend"
import vrdom_deleteInner from "./deleteInner"
import vrdom_patchChildren from "./patch/patchChildren"
import cleanDOMElement from "./cleanDOMElement"
import vrdom_isTagNameComponent from "./is/isTagNameComponent"
import vrdom_isTagNameFragment from "./is/isTagNameFragment"
import vrdom_isTagNameComponentOrFragment from "./is/isTagNameComponentOrFragment"
import vrdom_isTagNameList from "./is/isTagNameList"

const VRDOM = {
    createElement: vrdom_createElement,
    createNode: vrdom_createNode,
    render: vrdom_render,
    mount: vrdom_mount,
    patch: vrdom_patch,
    patchChildren: vrdom_patchChildren,
    append: vrdom_append,
    prepend: vrdom_prepend,

    delete: vrdom_delete,
    deleteInner: vrdom_deleteInner,
    cleanElement: cleanDOMElement,

    isTagNameComponent: vrdom_isTagNameComponent,
    isTagNameFragment: vrdom_isTagNameFragment,
    isTagNameList: vrdom_isTagNameList,
    isTagNameComponentOrFragment: vrdom_isTagNameComponentOrFragment,

    Fragment: 69
}

export default VRDOM