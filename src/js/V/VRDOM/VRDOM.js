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

import vrdom_createElement from "./createElement"
import vrdom_jsx from "./jsx/jsx"
import vrdom_render from "./render/render"
import vrdom_mount from "./mount"
import vrdom_delete from "./delete"
import vrdom_patch from "./patch/patch"
import vrdom_append from "./append"
import vrdom_prepend from "./prepend"
import vrdom_deleteInner from "./deleteInner"
import vrdom_patchChildren from "./patch/patchChildren"
import cleanElement from "./cleanElement"
import vrdom_isTagNameComponent from "./is/isTagNameComponent"
import vrdom_isTagNameFragment from "./is/isTagNameFragment"
import vrdom_isTagNameComponentOrFragment from "./is/isTagNameComponentOrFragment"
import vrdom_isTagNameList from "./is/isTagNameList"

/**
 * Virtual DOM that operates on Real DOM and does not save previous rendered state. Written specially for Telegram V.
 *
 * `Fragment` is just a simple component, not React.Fragment.
 */
const VRDOM = {
    createElement: vrdom_createElement,
    jsx: vrdom_jsx,
    render: vrdom_render,
    mount: vrdom_mount,
    patch: vrdom_patch,
    patchChildren: vrdom_patchChildren,
    append: vrdom_append,
    prepend: vrdom_prepend,

    delete: vrdom_delete,
    deleteInner: vrdom_deleteInner,
    cleanElement: cleanElement,

    isTagNameComponent: vrdom_isTagNameComponent,
    isTagNameFragment: vrdom_isTagNameFragment,
    isTagNameList: vrdom_isTagNameList,
    isTagNameComponentOrFragment: vrdom_isTagNameComponentOrFragment,

    // TEXTAREA_SET_VALUE: 0,
    // TEXTAREA_SET_INNER_HTML: 1,
    // TEXTAREA_PATCH: 2,

    COMPONENT_PATCH_DEFAULT: 0,
    COMPONENT_PATCH_FAST: 1, // currently is not working

    Fragment: 69
}

export default VRDOM