import vdom_isNamedComponent from "./check/isNamedComponent"
import vdom_isSimpleComponent from "./check/isSimpleComponent"
import vdom_isVNode from "./check/isVNode"
import AppFramework from "../framework"
import {VRNode} from "../vrdom/VRNode"

function removeIfs(array) {
    for (let i = 0; i < array.length; i++) {
        if (vdom_isVNode(array[i]) && !array[i].renderIf) {
            array.splice(i, 1)
        }
    }
}

/**
 * Creates Virtual Node
 *
 * WARNING: Virtual Node != Component. Thus, methods with same name can do different job!
 *
 * Components:
 *
 * A component is simply a function that passes attributes as parameters and returns virtual node.
 *
 * - simple component:
 *   {@code
 *      const Component = ({someProperty}) => {
 *          return <h1>{someProperty}</h1>
 *      }
 *
 *      const vNode = (
 *          <div className="someClass">
 *              <Component someProperty={`Today is ${new Date()}`}/>
 *          </div>
 *      )
 *   }
 *
 * - component with slot:
 *   {@code
 *      const ComponentWithSlot = ({someProperty, slot}) => {
 *          return (
 *              <div>
 *                  <h1>{someProperty}</h1>
 *                  {slot}
 *              </div>
 *          )
 *      }
 *
 *      const vNode = (
 *          <div className="someClass">
 *              <ComponentWithSlot someProperty={`Today is ${new Date()}`}>
 *                  <p>
 *                      lorem ipsum dolor sit amet..
 *                  </p>
 *              </ComponentWithSlot>
 *          </div>
 *      )
 *   }
 *
 * - named component:
 *   {@code
 *      const NamedComponent = {
 *          name: "named-component",
 *          h({someProperty}) {
 *              return <h1>{someProperty}</h1>
 *          }
 *      }
 *
 *      // ...
 *   }
 *
 * @param tagName
 * @param vNode
 * @returns {VRNode}
 */
function vdom_h(tagName, vNode) {

    throw new Error("deprecated")
    // component
    if (vdom_isSimpleComponent(tagName)) {
        return tagName(Object.assign(vNode.attrs, {slot: vNode.children}))
    }

    // named component
    // todo fixme create new component!!!
    // if (vdom_isNamedComponent(tagName)) {
    //     let component = tagName
    //
    //     if (!component.__) {
    //         component = AppFramework.createComponent(component)
    //     }
    //
    //     Object.assign(component.props, vNode.attrs)
    //     component.slot = vNode.children
    //
    //     return component
    // }

    return new VRNode(tagName, vNode)
}

export default vdom_h
