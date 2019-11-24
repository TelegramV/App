/**
 * Creates Virtual Node
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
 * @param attrs element attributes
 * @param options passed when creating element by using {@code document.createElement(tagName, options)}
 * @param events
 * @param children
 * @param dangerouslySetInnerHTML
 * @returns {any}
 */
import vdom_isNamedComponent from "./check/isNamedComponent"
import vdom_isSimpleComponent from "./check/isSimpleComponent"

function vdom_h(tagName, {attrs = {}, options = {}, events = {}, children = [], dangerouslySetInnerHTML = false, renderIf = true} = {}) {
    const vElem = Object.create(null)

    // component
    if (vdom_isSimpleComponent(tagName)) {
        return tagName(Object.assign(attrs, {slot: children}))
    }

    // named component
    if (vdom_isNamedComponent(tagName)) {
        const vNode = tagName.h(Object.assign(attrs, {slot: children}))
        vNode.attrs["data-component"] = tagName.name
        vNode.renderIf = renderIf
        return vNode
    }

    Object.assign(vElem, {
        tagName,
        attrs,
        options,
        events,
        children,
        dangerouslySetInnerHTML,
        renderIf
    })

    return vElem
}

export default vdom_h
