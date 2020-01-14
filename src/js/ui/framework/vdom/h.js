import vdom_isNamedComponent from "./check/isNamedComponent"
import vdom_isSimpleComponent from "./check/isSimpleComponent"
import vdom_isVNode from "./check/isVNode"
import {VNode} from "./vNode"

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
 * @returns {VNode}
 */
function vdom_h(tagName, vNode) {
    const vElem = Object.create(VNode)

    removeIfs(vNode.children)

    // component
    if (vdom_isSimpleComponent(tagName)) {
        return tagName(Object.assign(vNode.attrs, {slot: vNode.children}))
    }

    // named component
    if (vdom_isNamedComponent(tagName)) {
        const component = tagName

        if (!component.__ || !component.__.inited) {
            // component creation
            component.__ = component.__ || {
                inited: false,
                mounted: false,
                destroyed: false,
                created: false,
                reactive: {}
            }

            component.$el = component.$el || undefined
            component.vParent = component.vParent || undefined
            component.state = component.state || {}

            component.props = component.props || {}

            component.h = (component.h || function () {
                throw new Error("implement pls")
            }).bind(component)

            component.created = (component.created || function () {
            }).bind(component)

            component.changed = (component.changed || function (key, value) {
            }).bind(component)

            component.mounted = (component.mounted || function () {
            }).bind(component)

            component.destroy = (component.destroy || function () {
            }).bind(component)

            component.patch = (component.patch || function (vNode) {
                return vNode
            }).bind(component)

            component.delete = (component.delete || function () {
                this.destroy()
                this.$el.remove()
            }).bind(component)

            component.__render = (component.__render || function (props) {
                this.__init()

                this.props = props
                const vNode = this.h(props)

                vNode.component = this
                vNode.attrs["data-component"] = this.name

                return vNode
            }).bind(component)

            component.__patch = (component.__patch || function (props) {
                this.__init()

                this.$el = VDOM.patchReal(this.$el, this.__render(props))
            }).bind(component)

            component.__init = (component.__init || function () {
                if (!this.__.inited) {
                    for (const [key, value] of Object.entries(this)) {
                        if (typeof value === "function") {
                            this[key] = value.bind(this)
                        }
                    }

                    for (const [k, v] of Object.entries(this.state)) {
                        if (v && v.__rc) {
                            v.component = this
                            v.key = k
                            this.state[k] = v.default
                        }
                    }

                    this.__.inited = true
                }
            }).bind(component)
        }

        // debugger

        component.__init()

        const vComponentNode = component.__render(Object.assign(vNode.attrs, {slot: vNode.children}))

        vComponentNode.renderIf = vNode.renderIf

        return vComponentNode
    }

    Object.assign(vElem, vNode)
    vElem.tagName = tagName

    return vElem
}

export default vdom_h
