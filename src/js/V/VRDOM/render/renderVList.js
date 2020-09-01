// /*
//  * Telegram V
//  * Copyright (C) 2020 Davyd Kohut
//  *
//  * This program is free software: you can redistribute it and/or modify
//  * it under the terms of the GNU General Public License as published by
//  * the Free Software Foundation, either version 3 of the License, or
//  * (at your option) any later version.
//  *
//  * This program is distributed in the hope that it will be useful,
//  * but WITHOUT ANY WARRANTY; without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  * GNU General Public License for more details.
//  *
//  * You should have received a copy of the GNU General Public License
//  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
//  *
//  */
//
// import VListVRNode from "../list/VListVRNode"
// import vrdom_append from "../append"
// import type {VRenderProps} from "../types/types"
// import vrdom_render from "./render"
// import VApp from "../../vapp"
//
// function vrdom_renderVListVRNode(node: VListVRNode, props: VRenderProps) {
//     const listInstance = new (node.tag)({list: node.list, template: node.template})
//
//     listInstance.identifier = String(++(VApp.latestInstantiatedComponent))
//     listInstance.$el = vrdom_render(node.wrapper)
//     listInstance.$el.__v.list = listInstance
//
//     const items = listInstance.render()
//
//     items.forEach(value => {
//         listInstance.childNodes.push(
//             vrdom_append(value, listInstance.$el, {xmlns: props.xmlns})
//         )
//     })
//
//     return listInstance.$el
// }
//
// export default vrdom_renderVListVRNode