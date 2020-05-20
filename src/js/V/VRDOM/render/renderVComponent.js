// /*
//  * Copyright 2020 Telegram V authors.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  *
//  */
//
// import vrdom_render from "./render"
// import VComponent from "../component/VComponent"
// import VComponentVRNode from "../component/VComponentVRNode"
// import {initElement} from "./renderElement"
// import VApp from "../../vapp"
//
// export function vrdom_instantiateVComponentVNode(node: VComponentVRNode) {
//     const componentInstance: VComponent = new (node.component)({
//         props: node.attrs,
//         slot: node.slot,
//     })
//
//     if (node.ref && node.ref.__component_ref) {
//         node.ref.component = componentInstance
//     }
//
//     if (componentInstance.identifier) {
//         componentInstance.identifier = String(componentInstance.identifier)
//     } else if (node.identifier) {
//         componentInstance.identifier = String(node.identifier)
//     } else {
//         componentInstance.identifier = String(VApp.uniqueComponentId())
//     }
//
//     componentInstance.__init.call(componentInstance)
//
//     return componentInstance
// }
//
// /**
//  * @param {VComponentVRNode} node
//  * @param $node
//  */
// function vrdom_renderVComponentVNode(node: VComponentVRNode, $node: HTMLElement = undefined) {
//     const componentInstance = vrdom_instantiateVComponentVNode(node)
//
//     if (!$node) {
//         const renderedVRNode = componentInstance.__render.call(componentInstance)
//
//         if (renderedVRNode instanceof VComponentVRNode) {
//             throw new Error("Components on top level are forbidden.")
//         }
//
//         $node = vrdom_render(renderedVRNode)
//     }
//
//     initElement($node)
//     $node.__v.component = componentInstance
//     componentInstance.$el = $node
//
//     return $node
// }
//
//
// export default vrdom_renderVComponentVNode