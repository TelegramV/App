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
 * @param tagName
 * @param attrs element attributes
 * @param constructor used when passed {@link HTMLElement} instance
 * @param options passed when creating element by using {@code document.createElement(tagName, options)}
 * @param events
 * @param children
 * @param dangerouslySetInnerHTML
 * @returns {any}
 */
export function vdom_h(tagName, {attrs = {}, options = {}, events = {}, children = [], dangerouslySetInnerHTML = false} = {}) {
    const vElem = Object.create(null);

    // component
    if (typeof tagName === "function") {
        return tagName(Object.assign(attrs, {slot: children}))
    }

    if (tagName === "a" && !attrs.target) {
        attrs.target = "_blank"
    }
    // console.warn(tagName)

    Object.assign(vElem, {
        tagName,
        attrs,
        constructor,
        options,
        events,
        children,
        dangerouslySetInnerHTML
    })

    return vElem
}

export default vdom_h
