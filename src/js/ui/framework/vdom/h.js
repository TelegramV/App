import vdom_isNamedComponent from "./check/isNamedComponent"
import vdom_isSimpleComponent from "./check/isSimpleComponent"
import vdom_isVNode from "./check/isVNode"
import vdom_createEmptyNode from "./createEmptyNode"
import AppFramework from "../framework"

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
 * @returns {*}
 */
function vdom_h(tagName, vNode) {
    // removeIfs(vNode.children) // todo: uncomment this if there is a need. but without this rendering is faster

    // for fragments
    // if (tagName === VDOM.Fragment) {
    //     console.log(tagName, vNode)
    //     if (!vNode.parent) {
    //         throw new Error("fragment without parent cannot be rendered")
    //     } else {
    //         vNode.parent.children = []
    //         vNode.parent.children.push(...vNode.children)
    //     }
    // }

    // component
    if (vdom_isSimpleComponent(tagName)) {
        return tagName(Object.assign(vNode.attrs, {slot: vNode.children}))
    }

    // named component
    // todo fixme create new component!!!
    if (vdom_isNamedComponent(tagName)) {
        let component = tagName

        if (!component.__) {
            component = AppFramework.createComponent(component)
        }

        component.__init()

        const vComponentElem = component.__render(Object.assign(vNode.attrs, {slot: vNode.children}))

        vComponentElem.renderIf = vNode.renderIf

        return vComponentElem
    }

    const vElem = vdom_createEmptyNode()
    Object.assign(vElem, vNode)
    vElem.tagName = tagName

    // for fragments
    // vElem.children.forEach(vChild => {
    //     console.log("setting parent", vElem, vChild)
    //     if (vdom_isVNode(vChild)) {
    //         vChild.parent = vElem
    //     }
    // })

    return vElem
}

export default vdom_h
